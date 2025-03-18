import * as lucide from 'lucide-react';

export type LucideIcon = (keyof typeof lucide.icons);

export type IconName = LucideIcon | string;

export interface IconProps extends lucide.LucideProps {
    readonly name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
    const IconComponent = lucide.icons[name as LucideIcon];
    if (!IconComponent) {
        throw new Error(`Icon "${name}" not found`);
    }

    return <IconComponent size={14} strokeWidth={1} absoluteStrokeWidth {...props} />;
};
