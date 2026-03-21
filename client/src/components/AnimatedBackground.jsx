import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * AnimatedBackground - Renders animated crimson particles, glowing streaks,
 * and a subtle grid overlay inspired by the premium dark UI reference
 */
export default function AnimatedBackground() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isDark) return;

    // Create floating particles
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 15 + 10;
      const opacity = Math.random() * 0.5 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        background: rgba(239, 68, 68, ${opacity});
        box-shadow: 0 0 ${size * 3}px rgba(239, 68, 68, ${opacity * 0.5});
        animation: floatParticle ${duration}s ${delay}s linear infinite;
      `;

      container.appendChild(particle);
      particles.push(particle);
    }

    // Create falling streak lines (like in the reference)
    const lines = [];
    const lineCount = 8;

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.classList.add('particle-line');

      const left = Math.random() * 100;
      const height = Math.random() * 80 + 40;
      const delay = Math.random() * 12;
      const duration = Math.random() * 4 + 3;
      const opacity = Math.random() * 0.15 + 0.05;

      line.style.cssText = `
        left: ${left}%;
        top: ${Math.random() * 30}%;
        height: ${height}px;
        background: linear-gradient(180deg, rgba(220, 38, 38, ${opacity}), transparent);
        animation: streakDown ${duration}s ${delay}s ease-in infinite;
      `;

      container.appendChild(line);
      lines.push(line);
    }

    // Create small dot markers at streak endpoints
    const dots = [];
    const dotCount = 6;

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('particle');

      const size = 4;
      const left = Math.random() * 90 + 5;
      const top = Math.random() * 80 + 10;

      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        background: rgba(220, 38, 38, 0.6);
        box-shadow: 0 0 8px rgba(220, 38, 38, 0.4), 0 0 20px rgba(220, 38, 38, 0.15);
        animation: pulseGlow ${Math.random() * 4 + 3}s ${Math.random() * 3}s ease-in-out infinite;
      `;

      container.appendChild(dot);
      dots.push(dot);
    }

    return () => {
      [...particles, ...lines, ...dots].forEach(el => {
        if (container.contains(el)) container.removeChild(el);
      });
    };
  }, [isDark]);

  // Only show for light theme (which is our crimson dark theme)
  if (isDark) return null;

  return (
    <div ref={containerRef} className="animated-bg">
      <div className="grid-overlay" />
    </div>
  );
}
