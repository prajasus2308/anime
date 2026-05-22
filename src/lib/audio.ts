let audioCtx: AudioContext | null = null;
let ambientOscillators: OscillatorNode[] = [];
let ambientGain: GainNode | null = null;

export const playClickSound = (muted: boolean) => {
    if (muted) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // Up to A5
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
};

export const toggleAmbientAudio = (playing: boolean) => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (playing) {
        ambientGain = audioCtx.createGain();
        ambientGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        ambientGain.connect(audioCtx.destination);

        // Simple lo-fi drone chord (Cmaj7-like using oscillators)
        const freqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
        freqs.forEach(f => {
            const osc = audioCtx!.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, audioCtx!.currentTime);
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
