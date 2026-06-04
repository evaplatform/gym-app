export default function setFirstLabelUppercase(label: string): string {
    return label.charAt(0).toUpperCase() + label.slice(1);
}