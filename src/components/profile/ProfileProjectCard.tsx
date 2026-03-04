import Image from "next/image";
import { Pin, Edit2, Trash2, Heart } from "lucide-react";
import { Prompt } from "@/types/prompt";
import { useState, useEffect } from "react";

interface ProfileProjectCardProps extends Prompt {
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onTogglePin?: () => void;
    likesCount?: number;
    isLikedByUser?: boolean;
    onToggleLike?: () => void;
}

export function ProfileProjectCard({
    title,
    prompt,
    image,
    imageAlt,
    tags,
    onClick,
    onEdit,
    onDelete,
    isPinned,
    onTogglePin,
    likesCount = 0,
    isLikedByUser = false,
    onToggleLike
}: ProfileProjectCardProps) {
    // Determine category based on tags or default
    const category = tags[0] || "COMPONENT";

    // Generate a stable random ref for this render cycle
    const [randomRef, setRandomRef] = useState<string>("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRandomRef(Math.random().toString(16).substring(2, 8).toUpperCase());
    }, []);

    return (
        <div
            onClick={onClick}
            className="group relative bg-white border-[3px] border-ink p-0 cursor-pointer hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Section - Top 35% */}
            <div className="relative aspect-[16/9] w-full border-b-[3px] border-ink bg-gray-100 overflow-hidden group/image">
                <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter group-hover:contrast-125"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300" />

                <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold border border-white uppercase tracking-wider">
                    STITCH_V4
                </div>
            </div>

            {/* Content Section - Middle */}
            <div className="p-5 flex flex-col flex-grow bg-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-black text-xl leading-none text-ink line-clamp-2 uppercase tracking-tight break-all">
                        {title}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onTogglePin) onTogglePin();
                        }}
                        className={`p-1 transition-colors rounded-sm ml-2 shrink-0 ${isPinned ? 'text-accent-orange' : 'text-ink/20 hover:text-accent-orange'}`}
                        title={isPinned ? "Unpin design" : "Pin design"}
                    >
                        <Pin
                            className={`w-5 h-5 rotate-45 transition-colors ${isPinned ? 'fill-accent-orange' : ''}`}
                        />
                    </button>
                </div>

                {/* Category Badge & Interactions */}
                <div className="flex justify-between items-center mb-4">
                    <span className="inline-block bg-[#FFF8D6] border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                        {category}
                    </span>

                    {/* Likes */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleLike) onToggleLike();
                            }}
                            className={`p-1.5 border-2 border-transparent hover:border-ink hover:bg-white rounded-full transition-all group/like flex items-center justify-center`}
                            title={isLikedByUser ? "Unlike" : "Like"}
                        >
                            <Heart
                                className={`w-4 h-4 transition-all duration-300 ${isLikedByUser ? 'fill-red-500 text-red-500 scale-110' : 'text-ink/60 group-hover/like:text-red-500 group-hover/like:scale-110'}`}
                            />
                        </button>
                        <span className="font-mono text-xs font-bold text-ink/80 tabular-nums">
                            {likesCount}
                        </span>
                    </div>
                </div>

                {/* Description Divider */}
                <div className="border-t-2 border-dashed border-ink/20 mb-4"></div>

                {/* Technical/Description Text - More visible now */}
                <div className="font-mono text-xs text-ink/80 leading-relaxed font-medium mb-2 line-clamp-4">
                    &quot;{prompt}&quot;
                </div>

                <div className="mt-auto"></div>
            </div>

            {/* Action Footer - Always Visible */}
            <div className="grid grid-cols-2 border-t-[3px] border-ink bg-gray-50 divide-x-[3px] divide-ink">
                {onEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="py-3 flex items-center justify-center gap-2 hover:bg-accent-yellow transition-colors group/edit"
                    >
                        <Edit2 className="w-4 h-4 text-ink" />
                        <span className="font-black text-xs uppercase tracking-wider text-ink">Edit</span>
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="py-3 flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-colors group/delete"
                    >
                        <Trash2 className="w-4 h-4 text-ink group-hover/delete:text-white" />
                        <span className="font-black text-xs uppercase tracking-wider text-ink group-hover/delete:text-white">Delete</span>
                    </button>
                )}
                {/* Fallback if no actions, show footer text */}
                {(!onEdit && !onDelete) && (
                    <div className="col-span-2 py-3 px-4 font-mono text-[9px] text-ink/40 flex justify-between items-center">
                        <span className="truncate max-w-[150px]">{`ref::${randomRef}`}</span>
                        <span className="uppercase tracking-widest opacity-50">R-XYZ</span>
                    </div>
                )}
            </div>
        </div>
    );
}
