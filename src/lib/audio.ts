let audioCtx: AudioContext | null = null;
let ambientOscillators: OscillatorNode[] = [];
let ambientGain: GainNode | null = null;

const getContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

export const playClickSound = (muted: boolean) => {
    if (muted) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

export const playSuccessSound = (muted: boolean) => {
    if (muted) return;
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Patterns: [startFreq, endFreq, rampTime, totalDuration]
    const patterns = [
        [440, 880, 0.2, 0.3],    // A4 -> A5 (original)
        [523.25, 1046.5, 0.2, 0.3], // C5 -> C6
        [783.99, 391.99, 0.2, 0.3], // G5 -> G4 (descending)
        [329.63, 659.25, 0.15, 0.25], // E4 -> E5
    ];
    
    const [startF, endF, ramp, duration] = patterns[Math.floor(Math.random() * patterns.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startF, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endF, ctx.currentTime + ramp);
    
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
};

export const toggleAmbientAudio = (playing: boolean) => {
    const ctx = getContext();

    if (playing) {
        if (ambientGain) return; // Prevent multiple instances
        ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0.02, ctx.currentTime);
        ambientGain.connect(ctx.destination);

        // Simple lo-fi drone chord (Cmaj7-like using oscillators)
        const freqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
        freqs.forEach(f => {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            osc.connect(ambientGain!);
            osc.start();
            ambientOscillators.push(osc);
        });
    } else {
        ambientOscillators.forEach(osc => osc.stop());
        ambientOscillators = [];
        ambientGain?.disconnect();
        ambientGain = null;
    }
};
