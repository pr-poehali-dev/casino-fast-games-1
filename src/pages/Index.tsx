import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type GameType = 'crash' | 'roulette' | 'slots';

interface CrashHistory {
  multiplier: number;
  won: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'games'>('home');
  const [balance, setBalance] = useState(1000);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const [crashMultiplier, setCrashMultiplier] = useState(1.00);
  const [crashActive, setCrashActive] = useState(false);
  const [crashBet, setCrashBet] = useState(10);
  const [crashHistory, setCrashHistory] = useState<CrashHistory[]>([]);
  const [crashGraph, setCrashGraph] = useState<number[]>([]);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);

  const [rouletteNumber, setRouletteNumber] = useState<number | null>(null);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteBet, setRouletteBet] = useState(10);
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [rouletteHistory, setRouletteHistory] = useState<number[]>([]);

  const [slotSymbols, setSlotSymbols] = useState(['🍒', '🍋', '🍊']);
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [slotBet, setSlotBet] = useState(10);
  const [lastWin, setLastWin] = useState<number>(0);
  const [winStreak, setWinStreak] = useState(0);

  const startCrash = () => {
    if (balance < crashBet) return;
    setBalance(balance - crashBet);
    setCrashActive(true);
    setCrashMultiplier(1.00);
    setCrashGraph([1.00]);

    const crashPoint = 1 + Math.random() * 5 + Math.random() * 3;
    let currentMultiplier = 1.00;

    const interval = setInterval(() => {
      currentMultiplier += 0.02 + Math.random() * 0.03;
      
      setCrashMultiplier(currentMultiplier);
      setCrashGraph(prev => [...prev.slice(-50), currentMultiplier]);

      if (currentMultiplier >= autoCashout && crashActive) {
        cashoutCrash(currentMultiplier);
        clearInterval(interval);
        return;
      }

      if (currentMultiplier >= crashPoint) {
        clearInterval(interval);
        setCrashActive(false);
        setCrashHistory(prev => [{ multiplier: currentMultiplier, won: false }, ...prev.slice(0, 9)]);
      }
    }, 100);
  };

  const cashoutCrash = (multiplier?: number) => {
    if (!crashActive) return;
    const finalMultiplier = multiplier || crashMultiplier;
    const winnings = Math.floor(crashBet * finalMultiplier);
    setBalance(balance + winnings);
    setCrashActive(false);
    setCrashHistory(prev => [{ multiplier: finalMultiplier, won: true }, ...prev.slice(0, 9)]);
  };

  const spinRoulette = () => {
    if (balance < rouletteBet || rouletteSpinning) return;
    setBalance(balance - rouletteBet);
    setRouletteSpinning(true);

    const result = Math.floor(Math.random() * 37);
    const spins = 5 + Math.random() * 3;
    const finalRotation = rouletteRotation + 360 * spins + (result * 9.73);

    setRouletteRotation(finalRotation);

    setTimeout(() => {
      setRouletteNumber(result);
      setRouletteSpinning(false);
      setRouletteHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result > 0 && result % 2 === 0) {
        setBalance(prev => prev + rouletteBet * 2);
      }
    }, 3000);
  };

  const spinSlots = () => {
    if (balance < slotBet || slotSpinning) return;
    setBalance(balance - slotBet);
    setSlotSpinning(true);

    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '7️⃣'];
    const weights = [0.3, 0.25, 0.2, 0.15, 0.06, 0.03, 0.01];
    
    const getWeightedSymbol = () => {
      const random = Math.random();
      let cumulative = 0;
      for (let i = 0; i < symbols.length; i++) {
        cumulative += weights[i];
        if (random < cumulative) return symbols[i];
      }
      return symbols[0];
    };

    let spins = 0;
    const spinInterval = setInterval(() => {
      setSlotSymbols([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      spins++;

      if (spins > 20) {
        clearInterval(spinInterval);
        setSlotSpinning(false);

        const finalSymbols = [getWeightedSymbol(), getWeightedSymbol(), getWeightedSymbol()];
        setSlotSymbols(finalSymbols);

        let multiplier = 0;
        if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
          if (finalSymbols[0] === '7️⃣') multiplier = 100;
          else if (finalSymbols[0] === '⭐') multiplier = 50;
          else if (finalSymbols[0] === '💎') multiplier = 30;
          else multiplier = 10;
          
          const winAmount = slotBet * multiplier;
          setBalance(prev => prev + winAmount);
          setLastWin(winAmount);
          setWinStreak(prev => prev + 1);
        } else if (finalSymbols[0] === finalSymbols[1] || finalSymbols[1] === finalSymbols[2]) {
          const winAmount = slotBet * 2;
          setBalance(prev => prev + winAmount);
          setLastWin(winAmount);
          setWinStreak(0);
        } else {
          setLastWin(0);
          setWinStreak(0);
        }
      }
    }, 100);
  };

  const getRouletteColor = (num: number) => {
    if (num === 0) return 'bg-green-600';
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return redNumbers.includes(num) ? 'bg-red-600' : 'bg-gray-900';
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} className="text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">CryptoPlay</span>
          </div>

          <div className="flex gap-4">
            <Button
              variant={activeSection === 'home' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('home')}
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </Button>
            <Button
              variant={activeSection === 'games' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('games')}
            >
              <Icon name="Gamepad2" size={18} className="mr-2" />
              Игры
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Баланс:</span>
              <span className="ml-2 font-semibold text-lg">${balance}</span>
            </div>
            <Button variant="outline">
              <Icon name="User" size={18} />
            </Button>
          </div>
        </div>
      </nav>

      {activeSection === 'home' && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Играй. Выигрывай. Повторяй.
            </h1>
            <p className="text-xl text-muted-foreground">
              Современное крипто-казино с честной игрой и мгновенными выплатами
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => {
                setActiveSection('games');
                setSelectedGame('crash');
              }}>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Crash</h3>
                <p className="text-sm text-muted-foreground">
                  Следи за множителем и выводи вовремя
                </p>
              </Card>

              <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => {
                setActiveSection('games');
                setSelectedGame('roulette');
              }}>
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon name="Circle" size={24} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Рулетка</h3>
                <p className="text-sm text-muted-foreground">
                  Классическая игра с высокими коэффициентами
                </p>
              </Card>

              <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => {
                setActiveSection('games');
                setSelectedGame('slots');
              }}>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon name="Grid3x3" size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Слоты</h3>
                <p className="text-sm text-muted-foreground">
                  Собирай комбинации и получай джекпот
                </p>
              </Card>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground mt-2">RTP</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground mt-2">Поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent">10k+</div>
                <div className="text-sm text-muted-foreground mt-2">Игроков</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'games' && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Выбери игру</h2>

              <Card
                className={`p-4 cursor-pointer transition-all ${selectedGame === 'crash' ? 'ring-2 ring-primary' : 'hover:bg-card/80'}`}
                onClick={() => setSelectedGame('crash')}
              >
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Crash</h3>
                    <p className="text-xs text-muted-foreground">Быстрая игра</p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all ${selectedGame === 'roulette' ? 'ring-2 ring-secondary' : 'hover:bg-card/80'}`}
                onClick={() => setSelectedGame('roulette')}
              >
                <div className="flex items-center gap-3">
                  <Icon name="Circle" size={24} className="text-secondary" />
                  <div>
                    <h3 className="font-semibold">Рулетка</h3>
                    <p className="text-xs text-muted-foreground">Классика</p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-4 cursor-pointer transition-all ${selectedGame === 'slots' ? 'ring-2 ring-accent' : 'hover:bg-card/80'}`}
                onClick={() => setSelectedGame('slots')}
              >
                <div className="flex items-center gap-3">
                  <Icon name="Grid3x3" size={24} className="text-accent" />
                  <div>
                    <h3 className="font-semibold">Слоты</h3>
                    <p className="text-xs text-muted-foreground">Джекпот</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedGame === 'crash' && (
                <Card className="p-8 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Crash</h2>
                    <Badge variant="outline" className="text-sm">
                      <Icon name="History" size={14} className="mr-1" />
                      {crashHistory.length} игр
                    </Badge>
                  </div>

                  <div className="bg-muted rounded-xl p-6 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                        <polyline
                          points={crashGraph.map((val, i) => `${(i / crashGraph.length) * 200},${100 - (val * 10)}`).join(' ')}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                    
                    <div className="relative text-center">
                      <div className={`text-7xl font-bold ${crashActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
                        {crashMultiplier.toFixed(2)}x
                      </div>
                      {!crashActive && <p className="text-muted-foreground mt-2">Ждём следующий раунд...</p>}
                    </div>
                  </div>

                  {crashHistory.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-2">История</p>
                      <div className="flex gap-2 flex-wrap">
                        {crashHistory.map((item, i) => (
                          <Badge key={i} variant={item.won ? "default" : "destructive"} className="text-xs">
                            {item.multiplier.toFixed(2)}x
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                        <input
                          type="number"
                          value={crashBet}
                          onChange={(e) => setCrashBet(Number(e.target.value))}
                          disabled={crashActive}
                          className="w-full bg-muted rounded-lg px-4 py-3 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Авто-вывод</label>
                        <input
                          type="number"
                          step="0.1"
                          value={autoCashout}
                          onChange={(e) => setAutoCashout(Number(e.target.value))}
                          disabled={crashActive}
                          className="w-full bg-muted rounded-lg px-4 py-3 text-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={startCrash}
                        disabled={crashActive || balance < crashBet}
                        className="flex-1"
                        size="lg"
                      >
                        <Icon name="Rocket" size={18} className="mr-2" />
                        Играть
                      </Button>
                      <Button
                        onClick={() => cashoutCrash()}
                        disabled={!crashActive}
                        variant="secondary"
                        className="flex-1"
                        size="lg"
                      >
                        <Icon name="TrendingUp" size={18} className="mr-2" />
                        Вывести
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {selectedGame === 'roulette' && (
                <Card className="p-8 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Рулетка</h2>
                    <Badge variant="outline" className="text-sm">
                      Европейская
                    </Badge>
                  </div>

                  <div className="bg-muted rounded-xl p-8 mb-6 relative overflow-hidden">
                    <div className="relative w-64 h-64 mx-auto">
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-primary/20 transition-transform duration-3000 ease-out"
                        style={{ transform: `rotate(${rouletteRotation}deg)` }}
                      >
                        {Array.from({ length: 37 }).map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full ${getRouletteColor(i)} top-1/2 left-1/2`}
                            style={{
                              transform: `rotate(${i * 9.73}deg) translateY(-120px)`,
                              transformOrigin: '0 0'
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          {rouletteSpinning ? (
                            <Icon name="Loader2" size={48} className="animate-spin text-secondary" />
                          ) : rouletteNumber !== null ? (
                            <>
                              <div className="text-6xl font-bold text-primary">{rouletteNumber}</div>
                              <div className={`w-6 h-6 rounded-full mx-auto mt-2 ${getRouletteColor(rouletteNumber)}`} />
                            </>
                          ) : (
                            <div className="text-4xl text-muted-foreground">?</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {rouletteHistory.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-2">Последние числа</p>
                      <div className="flex gap-2 flex-wrap">
                        {rouletteHistory.map((num, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <Badge variant="outline" className="text-xs">{num}</Badge>
                            <div className={`w-4 h-4 rounded-full ${getRouletteColor(num)}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                      <input
                        type="number"
                        value={rouletteBet}
                        onChange={(e) => setRouletteBet(Number(e.target.value))}
                        disabled={rouletteSpinning}
                        className="w-full bg-muted rounded-lg px-4 py-3 text-lg"
                      />
                    </div>

                    <Button
                      onClick={spinRoulette}
                      disabled={rouletteSpinning || balance < rouletteBet}
                      className="w-full"
                      size="lg"
                    >
                      <Icon name="RotateCw" size={18} className="mr-2" />
                      {rouletteSpinning ? 'Крутим...' : 'Крутить'}
                    </Button>
                  </div>
                </Card>
              )}

              {selectedGame === 'slots' && (
                <Card className="p-8 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Слоты</h2>
                    {winStreak > 0 && (
                      <Badge variant="default" className="text-sm animate-pulse">
                        <Icon name="Flame" size={14} className="mr-1" />
                        Серия x{winStreak}
                      </Badge>
                    )}
                  </div>

                  <div className="bg-muted rounded-xl p-8 mb-6">
                    <div className="flex justify-center items-center gap-4 text-8xl mb-4">
                      {slotSymbols.map((symbol, i) => (
                        <div 
                          key={i} 
                          className={`${slotSpinning ? 'animate-bounce' : ''} bg-card rounded-lg p-4 border-2 border-border`}
                        >
                          {symbol}
                        </div>
                      ))}
                    </div>
                    
                    {lastWin > 0 && !slotSpinning && (
                      <div className="text-center">
                        <Badge variant="default" className="text-lg py-2 px-4 animate-scale-in">
                          <Icon name="Trophy" size={18} className="mr-2" />
                          Выигрыш +${lastWin}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 p-4 bg-card rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Таблица выплат</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>7️⃣ 7️⃣ 7️⃣</span>
                        <Badge variant="outline" className="ml-auto">x100</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⭐ ⭐ ⭐</span>
                        <Badge variant="outline" className="ml-auto">x50</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💎 💎 💎</span>
                        <Badge variant="outline" className="ml-auto">x30</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Любые 3</span>
                        <Badge variant="outline" className="ml-auto">x10</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Ставка</label>
                      <input
                        type="number"
                        value={slotBet}
                        onChange={(e) => setSlotBet(Number(e.target.value))}
                        disabled={slotSpinning}
                        className="w-full bg-muted rounded-lg px-4 py-3 text-lg"
                      />
                    </div>

                    <Button
                      onClick={spinSlots}
                      disabled={slotSpinning || balance < slotBet}
                      className="w-full"
                      size="lg"
                    >
                      <Icon name="Sparkles" size={18} className="mr-2" />
                      {slotSpinning ? 'Крутим...' : 'Крутить'}
                    </Button>
                  </div>
                </Card>
              )}

              {!selectedGame && (
                <Card className="p-12 text-center">
                  <Icon name="Gamepad2" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Выбери игру слева</h3>
                  <p className="text-muted-foreground">Crash, Рулетка или Слоты — выбор за тобой!</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
