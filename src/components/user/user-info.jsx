import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";
export const UserInfo = ({username, email}) => {
  return (
    <div className="flex md:justify-start  justify-end md:items-center gap-4">

      <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
        <AvatarImage src="/avatars/02.png" alt="Avatar" />
        <AvatarFallback className="m-[0_auto]"><PersonIcon/></AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{username || <span className="text-sm text-muted-foreground font-normal">No registrado</span>}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};
