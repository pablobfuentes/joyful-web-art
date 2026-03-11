import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDeliveryWindows, type DeliveryWindow } from "@/lib/delivery-windows";
import { cn } from "@/lib/utils";

const MONTH_FORMAT = new Intl.DateTimeFormat("es-MX", { month: "long" });

function formatWindowLabel(window: DeliveryWindow, firstHalfLabel: string, secondHalfLabel: string): string {
  const monthName = MONTH_FORMAT.format(new Date(window.year, window.month - 1, 1));
  const halfLabel = window.half === "Primera quincena" ? firstHalfLabel : secondHalfLabel;
  return `${halfLabel} de ${monthName} ${window.year}`;
}

const DeliveryWindowsSection = () => {
  const { getSectionContent, getStyleForPath } = useRegistryContent();
  const data = getSectionContent("deliveryWindows");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const result = useMemo(() => getDeliveryWindows(selectedDate), [selectedDate]);

  const displayDate = selectedDate.toLocaleDateString("es-MX", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <section
      id="delivery-windows"
      className="relative scroll-mt-24 pt-32 pb-24 px-6 max-md:px-4 md:py-24 bg-[hsl(var(--deliveryWindows-section-bg))] overflow-hidden"
    >
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />

      <div className="container mx-auto relative z-10 max-w-3xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2
            className="scroll-mt-28 font-display text-4xl md:text-5xl font-bold mb-4"
            style={getStyleForPath("deliveryWindows.title", "--foreground")}
          >
            {data.title}
          </h2>
          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            style={getStyleForPath("deliveryWindows.description", "--muted-foreground")}
          >
            {data.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label
              htmlFor="delivery-date-picker"
              className="text-sm font-medium shrink-0"
              style={getStyleForPath("deliveryWindows.datePickerLabel", "--foreground")}
            >
              {data.datePickerLabel}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="delivery-date-picker"
                  variant="outline"
                  className={cn(
                    "w-full sm:w-auto justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {displayDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card/80 backdrop-blur-sm p-6 shadow-playful">
            <p className="text-sm font-medium text-muted-foreground mb-1">{data.subscriptionGroupLabel}</p>
            <p className="text-xl font-display font-bold mb-6" style={getStyleForPath("deliveryWindows.subscriptionGroupLabel", "--foreground")}>
              {result.subscriptionHalf === "Primera quincena" ? data.firstHalf : data.secondHalf}
            </p>
            <p className="text-sm font-medium text-muted-foreground mb-3">{data.deliveryListHeading}</p>
            <ul className="space-y-2">
              {result.windows.map((win, i) => (
                <li
                  key={`${win.year}-${win.month}-${i}`}
                  className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0"
                >
                  <span className="w-7 h-7 rounded-full bg-primary/15 text-primary font-display font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-medium">
                    {formatWindowLabel(win, data.firstHalf, data.secondHalf)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeliveryWindowsSection;
