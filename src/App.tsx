import { useRef, useState, type CSSProperties } from "react";
import "./App.css";
import couple from "./assets/couple.jpg";
import wife from "./assets/wife.jpg";
const pages = [
  { id: "home", label: "01 / hello" },
  { id: "wish", label: "02 / wishes" },
  { id: "end", label: "03 / forever" },
  { id: "celebration", label: "04 / party" },
];

const wishes = [
  "Chúc vợ iu tuổi 24 luôn xinh đẹp, bình an và luôn giữ được nụ cười thật tươi trên môi. Mong mọi điều em mong ước đều dần trở thành hiện thực.",
  "Cảm ơn em vì đã đến bên anh, vì những yêu thương, những hy sinh và cả những ngày bình thường em biến thành thật đặc biệt. Có em là điều may mắn nhất trong cuộc đời anh.",
  "Anh không hứa sẽ làm mọi ngày đều hoàn hảo, nhưng anh hứa sẽ luôn ở bên, lắng nghe, yêu thương và cùng em đi qua mọi vui buồn phía trước.",
];

function App() {
  const [activePage, setActivePage] = useState("home");
  const [isOpened, setIsOpened] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const [fireworksBurst, setFireworksBurst] = useState(false);
  const [fireworksCount, setFireworksCount] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fireworksTimerRef = useRef<number | null>(null);
  const musicTimerRef = useRef<number | null>(null);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActivePage(id);
  };

  const startCelebration = () => {
    setIsCelebrating(true);
    goTo("celebration");
  };

  const blowCandles = () => {
    setCandlesOut(true);
    setMusicPlaying(true);
    setFireworksBurst(false);
    setFireworksCount((count) => count + 1);
    window.requestAnimationFrame(() => setFireworksBurst(true));
    if (fireworksTimerRef.current !== null) {
      window.clearTimeout(fireworksTimerRef.current);
    }
    fireworksTimerRef.current = window.setTimeout(() => {
      setFireworksBurst(false);
      fireworksTimerRef.current = null;
    }, 12500);

    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    void audioContextRef.current?.close();
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;
    if (musicTimerRef.current !== null) {
      window.clearTimeout(musicTimerRef.current);
    }
    musicTimerRef.current = window.setTimeout(() => {
      setMusicPlaying(false);
      musicTimerRef.current = null;
    }, 12500);
    const happyBirthday = [
      [261.63, 0.28],
      [261.63, 0.28],
      [293.66, 0.5],
      [261.63, 0.5],
      [349.23, 0.5],
      [329.63, 0.9],
      [261.63, 0.28],
      [261.63, 0.28],
      [293.66, 0.5],
      [261.63, 0.5],
      [392, 0.5],
      [349.23, 0.9],
      [261.63, 0.28],
      [261.63, 0.28],
      [523.25, 0.5],
      [440, 0.5],
      [349.23, 0.5],
      [329.63, 0.5],
      [293.66, 0.9],
      [466.16, 0.28],
      [466.16, 0.28],
      [440, 0.5],
      [349.23, 0.5],
      [392, 0.5],
      [349.23, 1],
    ] as const;
    let melodyTime = audioContext.currentTime + 0.15;
    happyBirthday.forEach(([frequency, duration]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, melodyTime);
      gain.gain.exponentialRampToValueAtTime(0.16, melodyTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        melodyTime + duration - 0.04,
      );
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(melodyTime);
      oscillator.stop(melodyTime + duration);
      melodyTime += duration + 0.035;
    });
    const buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 0.45,
      audioContext.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
    }
    const wind = audioContext.createBufferSource();
    const windGain = audioContext.createGain();
    wind.buffer = buffer;
    windGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    windGain.gain.exponentialRampToValueAtTime(
      0.18,
      audioContext.currentTime + 0.1,
    );
    windGain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.45,
    );
    wind.connect(windGain).connect(audioContext.destination);
    wind.start();

    const boom = audioContext.createOscillator();
    const boomGain = audioContext.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(110, audioContext.currentTime);
    boom.frequency.exponentialRampToValueAtTime(
      38,
      audioContext.currentTime + 0.55,
    );
    boomGain.gain.setValueAtTime(0.45, audioContext.currentTime);
    boomGain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.65,
    );
    boom.connect(boomGain).connect(audioContext.destination);
    boom.start();
    boom.stop(audioContext.currentTime + 0.7);

    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.16,
        audioContext.currentTime + index * 0.12 + 0.03,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + index * 0.12 + 0.65,
      );
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + index * 0.12);
      oscillator.stop(audioContext.currentTime + index * 0.12 + 0.7);
    });
  };

  const openWish = () => {
    setIsOpened(true);
    window.setTimeout(() => goTo("wish"), 180);
  };

  return (
    <main className={`birthday-page ${isOpened ? "is-opened" : ""}`}>
      <div className="grain" aria-hidden="true" />
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`star star-${index + 1}`} />
        ))}
      </div>

      <nav className="topbar">
        <button className="brand" type="button" onClick={() => goTo("home")}>
          <span className="brand-mark">✦</span>
          <span>
            dear<span className="brand-dot">.</span>you
          </span>
        </button>
        <div className="topbar-meta">
          <span className="status-dot" /> một ngày thật đặc biệt
        </div>
      </nav>

      <div className="page-nav" aria-label="Điều hướng các trang">
        {pages.map((page) => (
          <button
            type="button"
            className={activePage === page.id ? "active" : ""}
            key={page.id}
            onClick={() => goTo(page.id)}
          >
            {page.label}
          </button>
        ))}
      </div>

      <section className="page-section hero-section" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> Birthday letter · 10.11.2002
          </p>
          <h1>
            <span>Chúc mừng sinh nhật</span>
            <em>Vợ iu.</em>
          </h1>
          <p className="hero-description">
            Một ngày thật đặc biệt, vì người con gái anh yêu nhất đã xuất hiện
            trên thế giới này. Chào mừng em đến với tuổi 24 rực rỡ.
          </p>
          <button className="wish-button" type="button" onClick={openWish}>
            <span>Mở lời chúc của bạn</span>
            <span className="button-arrow">↗</span>
          </button>
        </div>
        <div className="hero-art" aria-label="Khung ảnh sinh nhật của bạn">
          <img
            className="hero-image"
            style={{ width: "90%", height: "90%" }}
            src={couple}
            alt="Ảnh kỷ niệm của hai vợ chồng"
          />
          <div className="art-label">
            <span>for you</span>
            <span>with love ✦</span>
          </div>
        </div>
      </section>

      <section
        className={`page-section celebration-section ${isCelebrating ? "celebration-started" : ""} ${fireworksBurst ? "fireworks-active" : ""}`}
        id="celebration"
      >
        <div className="fireworks" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties} />
          ))}
        </div>
        <div className="celebration-copy">
          <p className="eyebrow">
            <span /> 04 / birthday party
          </p>
          <h2>
            Happy Birthday
            <br />
            <em>vợ iu của anh!</em>
          </h2>
          <p>
            Tuổi 24 thật rực rỡ nhé. Hôm nay em cứ cười thật nhiều, vì cả bầu
            trời này đang cùng anh chúc mừng em.
          </p>
          <button
            className="wish-button party-button"
            type="button"
            onClick={blowCandles}
          >
            <span>
              {candlesOut ? "Thổi nến lần nữa ✦" : "Thổi nến & ước điều ước"}
            </span>
            <span className="button-arrow">♡</span>
          </button>
        </div>
        <div
          className={`cake-stage ${musicPlaying ? "music-candles" : ""} ${fireworksBurst ? "candles-burst" : ""}`}
          aria-label="Bánh sinh nhật với nến"
        >
          <div className="cake-glow" />
          <div className="cake">
            <div className="candles">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="flames">
              <b />
              <b />
              <b />
              <b />
              <b />
            </div>
            <div className="cake-top" />
            <div className="cake-cream" />
            <div className="cake-base" />
          </div>
          <div className="dancer dancer-left">♡</div>
          <div className="dancer dancer-right">♡</div>
        </div>
      </section>

      <section
        className={`page-section wish-section ${isOpened ? "wish-card-visible" : ""}`}
        id="wish"
        aria-live="polite"
      >
        <div className="wish-card">
          <div className="card-sparkle">✦</div>
          <p className="card-kicker">a little note for you</p>
          <h2>
            Chúc mừng sinh nhật,
            <br />
            <em>vợ yêu của anh.</em>
          </h2>
          <div className="wish-divider">
            <span>✦</span>
          </div>
          {wishes.map((wish) => (
            <p className="wish-text" key={wish}>
              {wish}
            </p>
          ))}
          <p className="signature">
            — yêu em hôm nay, ngày mai và cả những ngày sau nữa
          </p>
        </div>
        <button
          className="next-link"
          style={{ fontSize: "0.9rem" }}
          type="button"
          onClick={() => goTo("end")}
        >
          còn một điều nữa <span>↓</span>
        </button>
      </section>

      <section className="page-section end-section" id="end">
        <div className="end-copy">
          <p className="eyebrow">
            <span /> 03 / forever
          </p>
          <h2>
            Chúc vợ iu tuổi 24
            <br />
            <em>thật rực rỡ.</em>
          </h2>
          <p>
            Tuổi mới, hành trình mới. Anh mong chúng mình sẽ cùng nhau viết thêm
            thật nhiều chương hạnh phúc, cùng nhau già đi và vẫn yêu nhau như
            những ngày đầu.
          </p>
          <button
            className="wish-button"
            type="button"
            onClick={() => goTo("home")}
          >
            <span>Quay lại từ đầu</span>
            <span className="button-arrow">↗</span>
          </button>
          <button
            className="next-link party-link"
            type="button"
            onClick={startCelebration}
          >
            mở tiệc sinh nhật <span>↓</span>
          </button>
        </div>
        <img
          className="end-image"
          src={wife}
          alt="Ảnh kỷ niệm của hai vợ chồng"
        />
      </section>

      <footer className="footer">
        <span>made with</span>
        <span className="heart">♥</span>
        <span>for my lovely wife</span>
      </footer>

      {fireworksBurst && (
        <div className="burst-fireworks" aria-hidden="true">
          <strong className="firework-icon icon-one">✦</strong>
          <strong className="firework-icon icon-two">✺</strong>
          <strong className="firework-icon icon-three">✧</strong>
          <strong className="firework-icon icon-four">✹</strong>
          {Array.from({ length: 32 }, (_, index) => (
            <i
              key={`${fireworksCount}-${index}`}
              style={{ "--i": index } as CSSProperties}
            />
          ))}
        </div>
      )}
      {isOpened && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <i
              key={index}
              style={
                {
                  "--i": index,
                  left: `${(index * 37) % 100}%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
      {!isCelebrating && (
        <button
          className="party-fab"
          type="button"
          onClick={startCelebration}
          aria-label="Mở màn chúc mừng sinh nhật"
        >
          ✦
        </button>
      )}
    </main>
  );
}

export default App;
