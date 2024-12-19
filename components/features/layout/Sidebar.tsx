export function Sidebar() {
  const pathname = usePathname();
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  const showPremiumError = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPremiumOverlay(true);
  };
} 