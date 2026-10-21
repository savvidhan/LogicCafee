/** Generic card wrapper for consistent styling */
const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/80 ${className}`}>
    {children}
  </div>
);

export default Card;
