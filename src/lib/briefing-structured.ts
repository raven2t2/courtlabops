export interface BriefingMeta {
  title: string;
  generated_at: string;
  timezone: string;
  next_briefing: string;
}

export interface ActionCard {
  id: number;
  title: string;
  owner: string;
  start: string;
  duration: string;
  action: string;
  priority: string;
  priority_color: 'red' | 'orange' | 'yellow' | 'blue' | 'green' | 'gray';
}

export interface StrategicContextItem {
  theme: string;
  detail: string;
}

export interface SuccessMetricTask {
  task: string;
  completed: boolean;
}

export interface SuccessMetricInitiative {
  parent_idea: string;
  tasks: SuccessMetricTask[];
}

export interface SuccessMetrics {
  deadline: string;
  initiatives: SuccessMetricInitiative[];
}

export interface ExecutionStatus {
  owner: string;
  status: string;
  timeline: string;
}

export interface StructuredBriefingPayload {
  briefing_meta: BriefingMeta;
  needs_input: string[];
  action_cards: ActionCard[];
  strategic_context: StrategicContextItem[];
  success_metrics: SuccessMetrics;
  execution_status: ExecutionStatus;
}

function cleanInlineMarkdown(input: string) {
  return input
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

function compactWhitespace(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

function titleFromFallback(titleFallback: string) {
  return titleFallback.replace(/[_-]+/g, ' ').trim();
}

function parseGeneratedFromTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('en-US');
}

function priorityColorFromText(priority: string): ActionCard['priority_color'] {
  const normalized = priority.toLowerCase();
  if (normalized.includes('urgent')) return 'red';
  if (normalized.includes('critical')) return 'orange';
  if (normalized.includes('important')) return 'yellow';
  return 'blue';
}

function sanitizeActionCards(cards: ActionCard[]) {
  return cards.map((card, index) => ({
    ...card,
    id: Number.isFinite(card.id) ? card.id : index + 1,
    title: cleanInlineMarkdown(card.title),
    owner: cleanInlineMarkdown(card.owner),
    start: cleanInlineMarkdown(card.start),
    duration: cleanInlineMarkdown(card.duration),
    action: cleanInlineMarkdown(card.action),
    priority: cleanInlineMarkdown(card.priority),
    priority_color: card.priority_color || priorityColorFromText(card.priority),
  }));
}

function parseJsonBlock(content: string): unknown {
  const trimmed = content.trim();

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return JSON.parse(trimmed);
  }

  const codeBlockMatch = content.match(/```json\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) {
    return JSON.parse(codeBlockMatch[1]);
  }

  return null;
}

function tryStructuredFromJson(content: string): StructuredBriefingPayload | null {
  try {
    const parsed = parseJsonBlock(content);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const data = parsed as Partial<StructuredBriefingPayload>;
    if (!data.briefing_meta || !Array.isArray(data.action_cards)) {
      return null;
    }

    return {
      briefing_meta: {
        title: data.briefing_meta.title || '',
        generated_at: data.briefing_meta.generated_at || '',
        timezone: data.briefing_meta.timezone || '',
        next_briefing: data.briefing_meta.next_briefing || '',
      },
      needs_input: Array.isArray(data.needs_input) ? data.needs_input.map(cleanInlineMarkdown) : [],
      action_cards: sanitizeActionCards((data.action_cards as ActionCard[]) || []),
      strategic_context: Array.isArray(data.strategic_context)
        ? data.strategic_context.map((item) => ({
            theme: cleanInlineMarkdown(item.theme),
            detail: compactWhitespace(cleanInlineMarkdown(item.detail)),
          }))
        : [],
      success_metrics: {
        deadline: data.success_metrics?.deadline || '',
        initiatives: Array.isArray(data.success_metrics?.initiatives)
          ? data.success_metrics!.initiatives.map((initiative) => ({
              parent_idea: cleanInlineMarkdown(initiative.parent_idea),
              tasks: Array.isArray(initiative.tasks)
                ? initiative.tasks.map((task) => ({
                    task: cleanInlineMarkdown(task.task),
                    completed: Boolean(task.completed),
                  }))
                : [],
            }))
          : [],
      },
      execution_status: {
        owner: data.execution_status?.owner || '',
        status: data.execution_status?.status || '',
        timeline: data.execution_status?.timeline || '',
      },
    };
  } catch {
    return null;
  }
}

function sectionBetween(content: string, startMarker: RegExp, endMarker: RegExp) {
  const start = content.search(startMarker);
  if (start < 0) return '';
  const afterStart = content.slice(start);
  const startLineEnd = afterStart.indexOf('\n');
  const bodyStart = start + (startLineEnd >= 0 ? startLineEnd + 1 : 0);
  const body = content.slice(bodyStart);
  const end = body.search(endMarker);
  return end >= 0 ? body.slice(0, end) : body;
}

function parseNeedsInput(content: string) {
  const section = sectionBetween(
    content,
    /What Needs Michael Input:/i,
    /\n\*\*Timeline:|\n## |\n---|$/i
  );
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => cleanInlineMarkdown(line.replace(/^- /, '')));
}

function parseActionCards(content: string): ActionCard[] {
  const section = sectionBetween(content, /## EXECUTION PRIORITY/i, /\n## |\n---|$/i);
  const lines = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('|'));

  if (lines.length < 3) return [];

  const dataLines = lines.slice(2);
  return dataLines
    .map((line, index) => {
      const cols = line
        .split('|')
        .map((col) => col.trim())
        .filter(Boolean);
      if (cols.length < 6) return null;

      const priorityText = cleanInlineMarkdown(cols[5].replace(/[🔴🟠🟡🟢🔵]/g, '').trim());
      return {
        id: index + 1,
        title: cleanInlineMarkdown(cols[0].replace(/^#+\d*:\s*/i, '')),
        owner: cleanInlineMarkdown(cols[1]),
        start: cleanInlineMarkdown(cols[2]),
        duration: cleanInlineMarkdown(cols[3]),
        action: cleanInlineMarkdown(cols[4]),
        priority: priorityText,
        priority_color: priorityColorFromText(priorityText),
      } satisfies ActionCard;
    })
    .filter((card): card is ActionCard => Boolean(card));
}

function parseStrategicContext(content: string): StrategicContextItem[] {
  const section = sectionBetween(content, /## WHY THESE IDEAS NOW/i, /\n## |\n---|$/i);
  const itemRegex = /\d+\.\s+\*\*(.+?)\*\*:\s*([\s\S]*?)(?=\n\d+\.\s+\*\*|\n## |\n---|$)/g;
  const items: StrategicContextItem[] = [];

  let match = itemRegex.exec(section);
  while (match) {
    items.push({
      theme: cleanInlineMarkdown(match[1]),
      detail: compactWhitespace(cleanInlineMarkdown(match[2])),
    });
    match = itemRegex.exec(section);
  }

  return items;
}

function parseSuccessMetrics(content: string): SuccessMetrics {
  const deadlineMatch = content.match(/## SUCCESS METRICS\s*\(By\s*(.+?)\)/i);
  const deadline = deadlineMatch?.[1]?.trim() || '';

  const section = sectionBetween(content, /## SUCCESS METRICS/i, /\n## OWNER & NEXT STEPS|\n---|$/i);
  const initiativeRegex = /\*\*(Idea #[^*]+)\*\*:\s*([\s\S]*?)(?=\n\*\*Idea #|\n## |\n---|$)/g;
  const initiatives: SuccessMetricInitiative[] = [];

  let initiativeMatch = initiativeRegex.exec(section);
  while (initiativeMatch) {
    const tasks = initiativeMatch[2]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^-\s*[✅❌]/.test(line))
      .map((line) => ({
        task: cleanInlineMarkdown(line.replace(/^-\s*[✅❌]\s*/, '')),
        completed: line.includes('✅'),
      }));

    initiatives.push({
      parent_idea: cleanInlineMarkdown(initiativeMatch[1]),
      tasks,
    });

    initiativeMatch = initiativeRegex.exec(section);
  }

  return { deadline, initiatives };
}

function parseExecutionStatus(content: string): ExecutionStatus {
  const owner = content.match(/\*\*Owner:\*\*\s*(.+)/i)?.[1]?.trim() || '';
  const status = content.match(/\*\*Status:\*\*\s*(.+)/i)?.[1]?.trim() || '';
  const timeline = content.match(/\*\*Timeline:\*\*\s*(.+)/i)?.[1]?.trim() || '';
  return { owner, status, timeline };
}

function parseMeta(content: string, titleFallback: string, timestamp: string): BriefingMeta {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || titleFromFallback(titleFallback);
  const generated =
    content.match(/\*\*Briefing Generated:\*\*\s*(.+)/i)?.[1]?.trim() || parseGeneratedFromTimestamp(timestamp);
  const nextBriefing = content.match(/\*\*Next Briefing:\*\*\s*(.+)/i)?.[1]?.trim() || '';
  return {
    title: cleanInlineMarkdown(heading),
    generated_at: generated,
    timezone: '',
    next_briefing: nextBriefing,
  };
}

function tryStructuredFromMarkdown(
  content: string,
  titleFallback: string,
  timestamp: string
): StructuredBriefingPayload | null {
  const actionCards = parseActionCards(content);
  const strategicContext = parseStrategicContext(content);
  const needsInput = parseNeedsInput(content);
  const successMetrics = parseSuccessMetrics(content);
  const executionStatus = parseExecutionStatus(content);

  const hasMeaningfulData =
    actionCards.length > 0 ||
    strategicContext.length > 0 ||
    needsInput.length > 0 ||
    successMetrics.initiatives.length > 0;

  if (!hasMeaningfulData) {
    return null;
  }

  return {
    briefing_meta: parseMeta(content, titleFallback, timestamp),
    needs_input: needsInput,
    action_cards: actionCards,
    strategic_context: strategicContext,
    success_metrics: successMetrics,
    execution_status: executionStatus,
  };
}

export function deriveStructuredBriefing(
  content: string,
  titleFallback: string,
  timestamp: string
): StructuredBriefingPayload | null {
  return (
    tryStructuredFromJson(content) ||
    tryStructuredFromMarkdown(content, titleFallback, timestamp)
  );
}
