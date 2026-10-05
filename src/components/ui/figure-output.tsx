interface FigureOutputProps {
  /** Figures Matplotlib en PNG encodé en base64 (voir RunResult.images) */
  images?: string[];
}

/** Affiche les figures produites par l'exécution d'un code Python (aucune requête : image en data:) */
const FigureOutput = ({ images }: FigureOutputProps) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="space-y-3">
      {images.map((image, index) => (
        <img
          key={index}
          src={`data:image/png;base64,${image}`}
          alt={`Figure ${index + 1} produite par le code Matplotlib`}
          className="max-w-full h-auto rounded-lg border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
};

export default FigureOutput;
