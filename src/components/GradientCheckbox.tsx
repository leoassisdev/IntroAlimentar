interface GradientCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

const GradientCheckbox = ({ checked, onChange, label, id }: GradientCheckboxProps) => {
  const inputId = id || `gc-${label.replace(/\s/g, '-')}`;

  return (
    <label className="checkbox-gradient group" htmlFor={inputId}>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="check-box" />
      <span className="ml-3 text-sm font-semibold text-foreground">{label}</span>
    </label>
  );
};

export default GradientCheckbox;
