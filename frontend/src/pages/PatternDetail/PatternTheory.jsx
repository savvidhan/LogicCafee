/**
 * PatternTheory
 * Renders all the rich pattern info from the seed:
 * description, keywords, sub-patterns, when to use,
 * complexity, code template.
 */

// Small reusable card wrapper
const InfoCard = ({ title, children }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
      {title}
    </h3>
    {children}
  </div>
);

// Simple bullet list
const BulletList = ({ items, emptyText }) => {
  if (!items?.length) {
    return <p className="text-sm text-zinc-600">{emptyText}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
          {item}
        </li>
      ))}
    </ul>
  );
};

const PatternTheory = ({ pattern }) => {
  if (!pattern) return null;

  return (
    <div className="mb-10 space-y-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">{pattern.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {pattern.description}
        </p>
      </div>

      {/* Keywords / signals */}
      {pattern.keywords?.length > 0 && (
        <InfoCard title="Keywords & signals">
          <div className="flex flex-wrap gap-2">
            {pattern.keywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </InfoCard>
      )}

      {/* When to use / When NOT to use — side by side on desktop */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="When to use">
          <BulletList items={pattern.whenToUse} emptyText="Varies by problem." />
        </InfoCard>

        <InfoCard title="When NOT to use">
          <BulletList items={pattern.whenNotToUse} emptyText="Use judgment." />
        </InfoCard>
      </div>

      {/* Sub-patterns / Variations */}
      {pattern.subPatterns?.length > 0 && (
        <InfoCard title="Variations">
          <div className="space-y-3">
            {pattern.subPatterns.map((sp, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-zinc-200">{sp.title}</p>
                <p className="text-xs text-zinc-500">{sp.description}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {/* Complexity + Code template side by side on desktop */}
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        {/* Complexity */}
        <InfoCard title="Complexity">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Time:</span>
              <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-emerald-400">
                {pattern.timeComplexity || "—"}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Space:</span>
              <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-amber-400">
                {pattern.spaceComplexity || "—"}
              </code>
            </div>
          </div>
        </InfoCard>

        {/* Code template */}
        {pattern.codeTemplate && (
          <InfoCard title="Code template">
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
              {pattern.codeTemplate}
            </pre>
          </InfoCard>
        )}
      </div>
    </div>
  );
};

export default PatternTheory;
