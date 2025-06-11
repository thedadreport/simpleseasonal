interface MultiSelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const MultiSelectButton = ({ 
  label, 
  selected, 
  onClick 
}: MultiSelectButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-all
        ${selected 
          ? 'bg-sage-green text-white' 
          : 'bg-light-sage text-gray-700 hover:bg-sage-green hover:bg-opacity-20'
        }
      `}
    >
      {label}
    </button>
  );
};

export default MultiSelectButton;