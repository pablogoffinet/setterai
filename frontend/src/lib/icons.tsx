import React from 'react';

type IconProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string };

function createIcon() {
  return function Icon(props: IconProps) {
    const { className, ...rest } = props;
    return <span aria-hidden className={className} {...rest} />;
  };
}

export const Brain = createIcon();
export const User = createIcon();
export const Building = createIcon();
export const Target = createIcon();
export const MessageSquare = createIcon();
export const Zap = createIcon();
export const Save = createIcon();
export const ArrowRight = createIcon();
export const Check = createIcon();
export const Plus = createIcon();
export const Trash2 = createIcon();
export const Upload = createIcon();
export const Globe = createIcon();
export const Users = createIcon();
export const TrendingUp = createIcon();
export const Award = createIcon();
export const Star = createIcon();
export const Search = createIcon();
export const Filter = createIcon();
export const Play = createIcon();
export const Pause = createIcon();
export const Eye = createIcon();
export const EyeOff = createIcon();
export const Copy = createIcon();
export const Key = createIcon();
export const Shield = createIcon();
export const Bell = createIcon();
export const UserPlus = createIcon();
export const Download = createIcon();
export const Mail = createIcon();
export const Calendar = createIcon();
export const MapPin = createIcon();
export const Briefcase = createIcon();
export const RefreshCw = createIcon();
export const Settings = createIcon();
export const BarChart3 = createIcon();
export const Linkedin = createIcon();
export const Edit = createIcon();
export default {};
