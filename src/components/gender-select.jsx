import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GenderSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="M">Mujer</SelectItem>
          <SelectItem value="H">Hombre</SelectItem>
          <SelectItem value="O">Otro</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
