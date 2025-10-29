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

  const handleNumberInput = (value: string, setter: (val: number) => void) => {
    if (value === '' || value === '0') {
      setter(0);
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        setter(num);
      }
    }
  };

  // Assumptions for calculations
  const TIME_PER_CALL = 15; // minutes per call (notatka + draft)
  const AUTOMATION_EFFICIENCY = 0.85; // 85% time saved

  const [results, setResults] = useState({
    totalManualTime: 0,
    totalTimeSaved: 0,
    moneySaved: 0,
    weeklyHoursSaved: 0,
    monthlyHoursSaved: 0,
    monthlyCalls: 0,
  });

  useEffect(() => {
    // Total calls per week
    const totalWeeklyCalls = salespeople * callsPerWeek;
    
    // Monthly calls
    const monthlyCalls = totalWeeklyCalls * 4.33; // average weeks per month
    
    // Time spent manually (minutes per week) - 15 min per call
    const weeklyManualTime = totalWeeklyCalls * TIME_PER_CALL;
    
    // Total time that could be saved with automation (minutes per week)
    const timeSavedMinutes = weeklyManualTime * AUTOMATION_EFFICIENCY;
    const timeSavedHours = timeSavedMinutes / 60;
    
    // Money saved per week
    const weeklySavings = timeSavedHours * hourlyCost * salespeople;
    
    // Monthly calculations
    const monthlyHoursSaved = timeSavedHours * 4.33; // average weeks per month
    const monthlySavings = weeklySavings * 4.33;

    setResults({
      totalManualTime: weeklyManualTime,
      totalTimeSaved: timeSavedMinutes,
      moneySaved: weeklySavings,
      weeklyHoursSaved: timeSavedHours,
      monthlyHoursSaved: monthlyHoursSaved,
      monthlyCalls: Math.round(monthlyCalls),
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
    <div className="min-h-screen bg-gradient-subtle py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background waves */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <img 
          src="/waves-background.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kalkulator Oszczędności CallOS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oblicz, ile czasu i pieniędzy odzyskasz, gdy CallOS automatycznie wypełni CRM i przygotuje podsumowania rozmów za Twój zespół
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
                  value={salespeople === 0 ? '' : salespeople}
                  onChange={(e) => handleNumberInput(e.target.value, setSalespeople)}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth [&::-webkit-inner-spin-button]:h-10 [&::-webkit-inner-spin-button]:w-6"
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
                  value={callsPerWeek === 0 ? '' : callsPerWeek}
                  onChange={(e) => handleNumberInput(e.target.value, setCallsPerWeek)}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth [&::-webkit-inner-spin-button]:h-10 [&::-webkit-inner-spin-button]:w-6"
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
                  value={callDuration === 0 ? '' : callDuration}
                  onChange={(e) => handleNumberInput(e.target.value, setCallDuration)}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth [&::-webkit-inner-spin-button]:h-10 [&::-webkit-inner-spin-button]:w-6"
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
                  value={hourlyCost === 0 ? '' : hourlyCost}
                  onChange={(e) => handleNumberInput(e.target.value, setHourlyCost)}
                  className="h-12 text-lg border-2 focus:border-primary transition-smooth [&::-webkit-inner-spin-button]:h-10 [&::-webkit-inner-spin-button]:w-6"
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
              {/* Monthly Calls */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-lg p-3">
                    <TrendingUp className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Liczba rozmów miesięcznie
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {results.monthlyCalls}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Time */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="bg-accent rounded-lg p-3">
                    <Clock className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Czas wprowadzania do CRM i draft
                    </h3>
                    <p className="text-2xl font-bold text-foreground">
                      {formatTime(results.totalManualTime)} / tydzień
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Savings */}
              <div className="bg-gradient-primary rounded-xl p-6 shadow-medium">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-primary-foreground mb-3">
                      Czas
                    </h3>
                    <p className="text-3xl font-bold text-primary-foreground">
                      {formatTime(results.totalTimeSaved)} / tydzień
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-2">
                      {results.weeklyHoursSaved.toFixed(1)} godz tygodniowo
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">
                      {results.monthlyHoursSaved.toFixed(0)} godz miesięcznie
                    </p>
                  </div>

                  <div className="border-t border-primary-foreground/20 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-foreground/10 rounded-lg p-3">
                        <DollarSign className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-primary-foreground mb-3">
                          Pieniądze
                        </h3>
                        <p className="text-2xl font-bold text-primary-foreground">
                          {formatCurrency(results.moneySaved)} / tydzień
                        </p>
                        <p className="text-2xl font-bold text-primary-foreground mt-1">
                          {formatCurrency(results.moneySaved * 4.33)} / miesiąc
                        </p>
                        <p className="text-2xl font-bold text-primary-foreground mt-1">
                          {formatCurrency(results.moneySaved * 52)} / rok
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Kalkulacja oparta na rzeczywistych danych z wdrożeń CallOS. Nie uwzględnia dodatkowych korzyści: lepszej jakości danych w CRM, automatycznego feedbacku dla zespołu i przygotowanych podsumowań dla klientów
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Problem-Solution Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card className="shadow-medium border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Problems Section */}
                <div className="bg-card p-8 border-r border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Znasz to?</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Twoi handlowcy:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Tracą godziny na wypełnianie CRM</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Zapominają o follow-upach</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Nie dostają systematycznego feedbacku</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">A Ty:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Nie masz czasu słuchać wszystkich rozmów</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Nie wiesz dlaczego leady się nie zamykają</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive mt-1">❌</span>
                          <span>Tracisz deals przez słabą dokumentację</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Solutions Section */}
                <div className="bg-gradient-primary p-8">
                  <h3 className="text-2xl font-bold text-primary-foreground mb-6">
                    CallOS rozwiązuje to wszystko automatycznie:
                  </h3>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-2 text-primary-foreground">
                      <span className="mt-1">✅</span>
                      <span>CRM wypełnia się sam po każdej rozmowie</span>
                    </li>
                    <li className="flex items-start gap-2 text-primary-foreground">
                      <span className="mt-1">✅</span>
                      <span>Gotowe emaile i zadania dla handlowców</span>
                    </li>
                    <li className="flex items-start gap-2 text-primary-foreground">
                      <span className="mt-1">✅</span>
                      <span>Spersonalizowany feedback oparty na Twoim procesie sprzedaży</span>
                    </li>
                    <li className="flex items-start gap-2 text-primary-foreground">
                      <span className="mt-1">✅</span>
                      <span>Dashboard pokazujący jakość rozmów zespołu</span>
                    </li>
                  </ul>

                  <div className="space-y-3 border-t border-primary-foreground/20 pt-6">
                    <p className="flex items-start gap-2 text-primary-foreground font-semibold">
                      <span>→</span>
                      <span>Zespół skupia się na sprzedaży, nie dokumentacji</span>
                    </p>
                    <p className="flex items-start gap-2 text-primary-foreground font-semibold">
                      <span>→</span>
                      <span>Ty masz pełną kontrolę bez mikromanagementu</span>
                    </p>
                  </div>

                  <div className="mt-8">
                    <a 
                      href="https://sailes.tech/kontakt/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-card hover:bg-card/90 text-foreground font-semibold px-6 py-3 rounded-lg transition-smooth shadow-soft"
                    >
                      Zobacz jak to działa - demo 10 min
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CRMCalculator;
