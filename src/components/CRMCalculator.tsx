import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Clock, TrendingUp, DollarSign } from "lucide-react";

const CRMCalculator = () => {
  const [salespeople, setSalespeople] = useState<number>(5);
  const [callsPerWeek, setCallsPerWeek] = useState<number>(20);
  const [callDuration, setCallDuration] = useState<number>(30);
  const [hourlyCost, setHourlyCost] = useState<number>(100);

  // Assumptions for calculations
  const CRM_ENTRY_TIME = 10; // minutes per call
  const ANALYSIS_TIME = 15; // minutes per call
  const AUTOMATION_EFFICIENCY = 0.85; // 85% time saved

  const [results, setResults] = useState({
    crmEntryTime: 0,
    analysisTime: 0,
    totalTimeSaved: 0,
    moneySaved: 0,
    weeklyHoursSaved: 0,
    monthlyHoursSaved: 0,
  });

  useEffect(() => {
    // Total calls per week
    const totalWeeklyCalls = salespeople * callsPerWeek;
    
    // Time spent on CRM entry (minutes per week)
    const weeklyEntryTime = totalWeeklyCalls * CRM_ENTRY_TIME;
    
    // Time spent on analysis (minutes per week)
    const weeklyAnalysisTime = totalWeeklyCalls * ANALYSIS_TIME;
    
    // Total time that could be saved with automation (minutes per week)
    const totalManualTime = weeklyEntryTime + weeklyAnalysisTime;
    const timeSavedMinutes = totalManualTime * AUTOMATION_EFFICIENCY;
    const timeSavedHours = timeSavedMinutes / 60;
    
    // Money saved per week
    const weeklySavings = timeSavedHours * hourlyCost * salespeople;
    
    // Monthly calculations
    const monthlyHoursSaved = timeSavedHours * 4.33; // average weeks per month
    const monthlySavings = weeklySavings * 4.33;

    setResults({
      crmEntryTime: weeklyEntryTime,
      analysisTime: weeklyAnalysisTime,
      totalTimeSaved: timeSavedMinutes,
      moneySaved: weeklySavings,
      weeklyHoursSaved: timeSavedHours,
      monthlyHoursSaved: monthlyHoursSaved,
    });
  }, [salespeople, callsPerWeek, callDuration, hourlyCost]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} godz`;
    return `${hours} godz ${mins} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kalkulator Oszczędności CRM
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oblicz, ile czasu i pieniędzy zaoszczędzisz dzięki automatycznemu uzupełnianiu CRM na podstawie rozmów
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="shadow-medium border-0">
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl">
              <CardTitle className="text-2xl">Dane wejściowe</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Podaj informacje o swojej firmie
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salespeople" className="text-base font-semibold">
                  Ilość handlowców
                </Label>
                <Input
                  id="salespeople"
                  type="number"
                  min="1"
                  value={salespeople}
                  onChange={(e) => setSalespeople(Number(e.target.value))}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calls" className="text-base font-semibold">
                  Ilość rozmów tygodniowo (na handlowca)
                </Label>
                <Input
                  id="calls"
                  type="number"
                  min="1"
                  value={callsPerWeek}
                  onChange={(e) => setCallsPerWeek(Number(e.target.value))}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-base font-semibold">
                  Czas jednej rozmowy (minuty)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={callDuration}
                  onChange={(e) => setCallDuration(Number(e.target.value))}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost" className="text-base font-semibold">
                  Koszt godziny handlowca (PLN)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  min="1"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(Number(e.target.value))}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-medium border-0 bg-secondary">
            <CardHeader>
              <CardTitle className="text-2xl">Wyniki</CardTitle>
              <CardDescription>
                Twoje potencjalne oszczędności
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Metrics */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-lg p-3">
                    <Clock className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Czas wprowadzania do CRM
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {formatTime(results.crmEntryTime)} / tydzień
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-lg p-3">
                    <TrendingUp className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Czas analizy rozmów
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {formatTime(results.analysisTime)} / tydzień
                    </p>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="bg-gradient-primary rounded-xl p-6 shadow-medium">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-primary-foreground/80 mb-2">
                      Oszczędność czasu
                    </h3>
                    <p className="text-3xl font-bold text-primary-foreground">
                      {formatTime(results.totalTimeSaved)} / tydzień
                    </p>
                    <p className="text-lg text-primary-foreground/90 mt-1">
                      {results.weeklyHoursSaved.toFixed(1)} godz tygodniowo
                    </p>
                    <p className="text-base text-primary-foreground/80 mt-1">
                      {results.monthlyHoursSaved.toFixed(0)} godz miesięcznie
                    </p>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-foreground/10 rounded-lg p-3">
                        <DollarSign className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-primary-foreground/80 mb-2">
                          Oszczędność finansowa
                        </h3>
                        <p className="text-3xl font-bold text-primary-foreground">
                          {formatCurrency(results.moneySaved)} / tydzień
                        </p>
                        <p className="text-lg text-primary-foreground/90 mt-1">
                          {formatCurrency(results.moneySaved * 4.33)} / miesiąc
                        </p>
                        <p className="text-lg text-primary-foreground/90 mt-1">
                          {formatCurrency(results.moneySaved * 52)} / rok
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                * Obliczenia zakładają 85% efektywność automatyzacji
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CRMCalculator;
