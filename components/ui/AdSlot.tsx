interface AdSlotProps {
  size?: 'leaderboard' | 'banner' | 'rectangle' | 'square' | 'sidebar';
  slotId?: string;
  className?: string;
}

export default function AdSlot(props: AdSlotProps) {
  // Suppress empty placeholder boxes to maintain clean premium layout
  if (props.slotId || props.size || props.className) {
    return null;
  }
  return null;
}
