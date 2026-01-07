import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type GameType = 'crash' | 'roulette' | 'slots';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'games'>('home');
  const [balance, setBalance] = useState(1000);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const [crashMultiplier, setCrashMultiplier] = useState(1.00);
  const [crashActive, setCrashActive] = useState(false);
  const [crashBet, setCrashBet] = useState(10);

  const [rouletteNumber, setRouletteNumber] = useState<number | null>(null);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteBet, setRouletteBet] = useState(10);

  const [slotSymbols, setSlotSymbols] = useState(['🍒', '🍋', '🍊']);
  const [slotSpinning, setSlotSpinning] = useState(false);
  const [slotBet, setSlotBet] = useState(10);

  const startCrash = () => {
    if (balance < crashBet) return;
    setBalance(balance - crashBet);
    setCrashActive(true);
    setCrashMultiplier(1.00);

    const interval = setInterval(() => {
      setCrashMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        if (Math.random() < 0.02 || newMultiplier > 10) {
          clearInterval(interval);
          setCrashActive(false);
          return prev;
        }
        return newMultiplier;
      });
    }, 100);
  };

  const cashoutCrash = () => {
    if (!crashActive) return;
    const winnings = Math.floor(crashBet * crashMultiplier);
    setBalance(balance + winnings);
    setCrashActive(false);
  };

  const spinRoulette = () => {
    if (balance < rouletteBet || rouletteSpinning) return;
    setBalance(balance - rouletteBet);
    setRouletteSpinning(true);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 37);
      setRouletteNumber(result);
      setRouletteSpinning(false);

      if (result > 0 && result % 2 === 0) {
        setBalance(prev => prev + rouletteBet * 2);
      }
    }, 2000);
  };

  const spinSlots = () => {
    if (balance < slotBet || slotSpinning) return;
    setBalance(balance - slotBet);
    setSlotSpinning(true);

    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐'];
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

        const finalSymbols = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        setSlotSymbols(finalSymbols);

        if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
          setBalance(prev => prev + slotBet * 10);
        }
      }
    }, 100);
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
                  <h2 className="text-3xl font-bold mb-6">Crash</h2>

                  <div className="bg-muted rounded-xl p-8 mb-6 text-center">
                    <div className={`text-7xl font-bold ${crashActive ? 'text-primary animate-pulse-glow' : 'text-muted-foreground'}`}>
                      {crashMultiplier.toFixed(2)}x
                    </div>
                    {!crashActive && <p className="text-muted-foreground mt-2">Ждём следующий раунд...</p>}
                  </div>

                  <div className="space-y-4">
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

                    <div className="flex gap-3">
                      <Button
                        onClick={startCrash}
                        disabled={crashActive || balance < crashBet}
                        className="flex-1"
                        size="lg"
                      >
                        Играть
                      </Button>
                      <Button
                        onClick={cashoutCrash}
                        disabled={!crashActive}
                        variant="secondary"
                        className="flex-1"
                        size="lg"
                      >
                        Вывести
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {selectedGame === 'roulette' && (
                <Card className="p-8 animate-scale-in">
                  <h2 className="text-3xl font-bold mb-6">Рулетка</h2>

                  <div className="bg-muted rounded-xl p-8 mb-6 text-center">
                    <div className={`text-7xl font-bold ${rouletteSpinning ? 'animate-spin text-secondary' : rouletteNumber !== null ? 'text-primary' : 'text-muted-foreground'}`}>
                      {rouletteSpinning ? '🎰' : rouletteNumber !== null ? rouletteNumber : '?'}
                    </div>
                    {!rouletteSpinning && rouletteNumber === null && (
                      <p className="text-muted-foreground mt-2">Сделайте ставку</p>
                    )}
                  </div>

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
                      {rouletteSpinning ? 'Крутим...' : 'Крутить'}
                    </Button>
                  </div>
                </Card>
              )}

              {selectedGame === 'slots' && (
                <Card className="p-8 animate-scale-in">
                  <h2 className="text-3xl font-bold mb-6">Слоты</h2>

                  <div className="bg-muted rounded-xl p-8 mb-6">
                    <div className="flex justify-center items-center gap-4 text-8xl">
                      {slotSymbols.map((symbol, i) => (
                        <div key={i} className={slotSpinning ? 'animate-bounce' : ''}>
                          {symbol}
                        </div>
                      ))}
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
