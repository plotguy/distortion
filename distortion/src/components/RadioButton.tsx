
type RadioButtonProps = {
    changed: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    isSelected: boolean;
    label: string;
    value: string;
};

const RadioButton = ({ changed, id, isSelected, label, value } : RadioButtonProps) => {
    return (
      <div className="RadioButton">
        <input
          id={id}
          onChange={changed}
          value={value}
          type="radio"
          checked={isSelected}
        />
        <label htmlFor={id} className="ml-2 text-lg text-white">{label}</label>
      </div>
    );
  };
  
export default RadioButton;