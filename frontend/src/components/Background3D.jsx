import React, { useEffect, useRef } from "react";
import { usePortfolio } from "../data/PortfolioContext";

export default function Background3D() {
  const { theme } = usePortfolio();
  const vantaContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const vantaEffectRef = useRef(null);

  // 1. VANTA CYBER EFFECT (For Cyber Theme)
  useEffect(() => {
    if (theme !== "cyber") {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.NET && vantaContainerRef.current && isMounted) {
        vantaEffectRef.current = window.VANTA.NET({
          el: vantaContainerRef.current,
          color: 0x22c55e,
          backgroundColor: 0x020617,
          points: 8.0,
          maxDistance: 20.0,
          spacing: 15.0,
        });
      }
    };

    if (window.VANTA && window.VANTA.NET) {
      initVanta();
    } else {
      const script1 = document.createElement("script");
      script1.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
        script2.onload = () => {
          initVanta();
        };
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    }

    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [theme]);

  // 2. HYPER-REALISTIC CINEMATIC FIRE & LAVA ENGINE (For Fire Theme)
  useEffect(() => {
    if (theme !== "fire") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking & fluid heat shockwave
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
      isMoving: false,
    };

    let prevMouseX = width / 2;
    let prevMouseY = height / 2;
    let mouseTimeout;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.vx = e.clientX - prevMouseX;
      mouse.vy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      mouse.isMoving = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 200);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Multi-tiered Embers System
    // Tier 1: Micro Sparks (fast, tiny, bright white-yellow)
    // Tier 2: Flame Body Embers (medium, organic swaying, fiery orange/gold glow)
    // Tier 3: Volcanic Smoke Plumes (large, translucent dark reddish ash)
    const particleCount = Math.min(220, Math.floor((width * height) / 4500));
    const particles = [];

    const createParticle = (overrideY = null) => {
      const tierRand = Math.random();
      let type = "ember"; // ember, spark, smoke
      let size, speedY, speedX, maxLife, opacity, color;

      if (tierRand < 0.25) {
        // Micro Spark
        type = "spark";
        size = Math.random() * 1.5 + 0.5;
        speedY = Math.random() * 2.8 + 1.8;
        speedX = (Math.random() - 0.5) * 1.2;
        maxLife = Math.random() * 120 + 60;
        opacity = Math.random() * 0.9 + 0.1;
        color = "#ffffff"; // Hot white
      } else if (tierRand < 0.82) {
        // Flame Ember
        type = "ember";
        size = Math.random() * 3.5 + 1.2;
        speedY = Math.random() * 1.6 + 0.7;
        speedX = (Math.random() - 0.5) * 0.9;
        maxLife = Math.random() * 240 + 120;
        opacity = Math.random() * 0.7 + 0.3;
        const emberPalette = ["#ff9100", "#ff5500", "#ff3300", "#ffcc00", "#e63900"];
        color = emberPalette[Math.floor(Math.random() * emberPalette.length)];
      } else {
        // Smoke Plume
        type = "smoke";
        size = Math.random() * 25 + 12;
        speedY = Math.random() * 0.9 + 0.3;
        speedX = (Math.random() - 0.5) * 0.5;
        maxLife = Math.random() * 300 + 180;
        opacity = Math.random() * 0.12 + 0.04;
        color = "rgba(45, 10, 5, ";
      }

      return {
        x: Math.random() * width,
        y: overrideY !== null ? overrideY : Math.random() * height,
        size,
        baseSize: size,
        speedY,
        speedX,
        type,
        color,
        opacity,
        life: Math.random() * maxLife,
        maxLife,
        swayFrequency: Math.random() * 0.03 + 0.01,
        swayAmplitude: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // Flame shockwave bursts on mouse move
    const flameSparks = [];
    const spawnMouseFlame = (x, y, vx, vy) => {
      const sparkCount = Math.min(6, Math.floor(Math.hypot(vx, vy) * 0.3) + 2);
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 1.5;
        const speed = Math.random() * 3 + 1;
        flameSparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5),
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 3.5 + 1,
          opacity: 1,
          color: Math.random() > 0.4 ? "#ffe600" : "#ff4500",
          life: 0,
          maxLife: Math.random() * 35 + 20,
        });
      }
    };

    // Preload 8K Photorealistic Fire & Magma Images
    let topLoaded = false;
    let middleLoaded = false;
    let bottomLoaded = false;

    const imgTop = new Image();
    imgTop.src = "/fire_top.png";
    imgTop.onload = () => { topLoaded = true; };

    const imgMiddle = new Image();
    imgMiddle.src = "/fire_middle.png";
    imgMiddle.onload = () => { middleLoaded = true; };

    const imgBottom = new Image();
    imgBottom.src = "/fire_bottom.png";
    imgBottom.onload = () => { bottomLoaded = true; };

    let waveTime = 0;

    // Render Loop
    const render = () => {
      waveTime += 0.025;

      // Mouse position interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      if (mouse.isMoving && Math.hypot(mouse.vx, mouse.vy) > 1) {
        spawnMouseFlame(mouse.targetX, mouse.targetY, mouse.vx, mouse.vy);
      }

      // Scroll Depth Progression (0.0 = Top Crater Peak, 0.5 = Magma Cavern, 1.0 = Core Abyss)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const depth = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 8K Photorealistic Volcanic Fire Background Image with Scroll Depth Blending
      ctx.save();
      if (depth < 0.35) {
        // Top Active Volcanic Crater Peak Image
        if (topLoaded || (imgTop.complete && imgTop.naturalWidth !== 0)) {
          ctx.drawImage(imgTop, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#1c0604";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Middle Magma Cavern Image as depth increases
        if (depth > 0.15 && (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0))) {
          const alpha = (depth - 0.15) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        }
      } else if (depth < 0.7) {
        // Middle Underground Magma Cavern Image
        if (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0)) {
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#120302";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Bottom Core Abyss Image as depth increases
        if (depth > 0.5 && (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0))) {
          const alpha = (depth - 0.5) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgBottom, 0, 0, width, height);
        }
      } else {
        // Bottom Planetary Core Abyss Image
        if (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0)) {
          ctx.drawImage(imgBottom, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#070101";
          ctx.fillRect(0, 0, width, height);
        }
      }
      ctx.restore();

      // Vignette Overlay for Crisp White & Orange Text Legibility
      ctx.fillStyle = "rgba(18, 3, 3, 0.42)";
      ctx.fillRect(0, 0, width, height);

      // 2. Liquid Lava Pouring Down (Top Viewport Streams & Falling Droplets)
      ctx.save();
      const dripTime = waveTime * 1.5;
      const dripCount = 14;
      for (let i = 0; i < dripCount; i++) {
        const x = (i + 0.5) * (width / dripCount) + Math.sin(i * 99 + dripTime * 0.5) * 15;
        const len = 40 + Math.sin(i * 1.7 + dripTime) * 30 + Math.cos(i * 3.3 + dripTime * 0.8) * 20;
        const w = 6 + Math.sin(i * 2.5 + dripTime) * 2;

        // Dripping Stream
        const dripGrad = ctx.createLinearGradient(x, 0, x, len);
        dripGrad.addColorStop(0, "rgba(255, 69, 0, 0.95)");
        dripGrad.addColorStop(0.7, "rgba(255, 140, 0, 0.85)");
        dripGrad.addColorStop(1, "rgba(255, 230, 100, 1)");

        ctx.beginPath();
        ctx.moveTo(x - w / 2, 0);
        ctx.quadraticCurveTo(x - w / 3, len * 0.6, x, len);
        ctx.quadraticCurveTo(x + w / 3, len * 0.6, x + w / 2, 0);
        ctx.closePath();
        ctx.fillStyle = dripGrad;
        ctx.shadowColor = "#ff4500";
        ctx.shadowBlur = 15;
        ctx.fill();

        // Glowing tip droplet bulb
        ctx.beginPath();
        ctx.arc(x, len, w * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffee55";
        ctx.shadowColor = "#ffa800";
        ctx.shadowBlur = 18;
        ctx.fill();

        // Falling Lava Drops Pouring Down
        const dropY = (len + (dripTime * 120 + i * 85) % (height - len));
        if (dropY < height - 20) {
          ctx.beginPath();
          ctx.ellipse(x, dropY, w * 0.6, w * 1.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#ffaa00";
          ctx.shadowColor = "#ff4500";
          ctx.shadowBlur = 14;
          ctx.fill();
        }
      }
      ctx.restore();

      // 3. Realistic Radiant Magma Heat Glow (Bottom Viewport Liquid Lava Pool)
      ctx.save();
      const magmaGrad = ctx.createLinearGradient(0, height - 140, 0, height);
      magmaGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      magmaGrad.addColorStop(0.3, "rgba(255, 69, 0, 0.25)");
      magmaGrad.addColorStop(0.7, "rgba(255, 140, 0, 0.6)");
      magmaGrad.addColorStop(1, "rgba(230, 40, 0, 0.9)");

      ctx.fillStyle = magmaGrad;
      ctx.fillRect(0, height - 140, width, 140);

      // Organic Magma Wave Motion
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + 40; x += 40) {
        const y =
          height -
          30 +
          Math.sin(x * 0.008 + waveTime * 1.5) * 15 +
          Math.cos(x * 0.004 - waveTime * 1.8) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const waveGrad = ctx.createLinearGradient(0, height - 50, 0, height);
      waveGrad.addColorStop(0, "rgba(255, 180, 0, 0.85)");
      waveGrad.addColorStop(0.5, "rgba(255, 69, 0, 0.95)");
      waveGrad.addColorStop(1, "rgba(180, 20, 0, 1)");
      ctx.fillStyle = waveGrad;
      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.restore();

      // 3. Render Mouse Flame Shockwaves
      for (let i = flameSparks.length - 1; i >= 0; i--) {
        const s = flameSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.08; // Upward buoyant force
        s.life++;
        s.opacity = 1 - s.life / s.maxLife;

        if (s.life >= s.maxLife || s.opacity <= 0) {
          flameSparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - s.life / s.maxLife * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = s.opacity;
        ctx.fill();
        ctx.restore();
      }

      // 4. Render Multi-Tiered Embers & Smoke
      particles.forEach((p, idx) => {
        p.life++;
        p.rotation += p.rotSpeed;

        // Swaying turbulent physics
        const sway = Math.sin(p.life * p.swayFrequency) * p.swayAmplitude;
        p.x += p.speedX + sway;
        p.y -= p.speedY;

        // Mouse Heat Distort & Repell
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 160;

        if (dist < maxDist) {
          const force = ((maxDist - dist) / maxDist) * 3.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force - 0.5;
        }

        // Reset when out of bounds or expired
        if (p.y < -30 || p.x < -30 || p.x > width + 30 || p.life >= p.maxLife) {
          particles[idx] = createParticle(height + 15);
          return;
        }

        // Life fade calculation
        const lifeRatio = p.life / p.maxLife;
        let currentOpacity = p.opacity;
        if (lifeRatio < 0.2) {
          currentOpacity *= lifeRatio / 0.2;
        } else if (lifeRatio > 0.7) {
          currentOpacity *= (1 - lifeRatio) / 0.3;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentOpacity);

        if (p.type === "smoke") {
          // Volcanic Smoke Tendril
          const radius = p.size * (1 + lifeRatio * 1.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${currentOpacity})`;
          ctx.fill();
        } else if (p.type === "spark") {
          // Micro Spark (White Hot Core)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = "#ffaa00";
          ctx.shadowBlur = 10;
          ctx.fill();
        } else {
          // Flame Ember (Realistic Flame Teardrop / Glow)
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Outer Radiant Flame Halo
          const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
          haloGrad.addColorStop(0, p.color);
          haloGrad.addColorStop(0.5, "rgba(255, 69, 0, 0.4)");
          haloGrad.addColorStop(1, "rgba(255, 69, 0, 0)");

          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          // Intense Flame Core Teardrop Shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = "#ff4500";
          ctx.shadowBlur = 12;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // 3. PHOTOREALISTIC DEEP OCEAN & MARINE LIFE SIMULATION (For Water Theme)
  useEffect(() => {
    if (theme !== "water") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    // Mouse Interactive Trail Bubbles & Shockwaves
    const ripples = [];
    const trailBubbles = [];
    let lastMouseX = width / 2;
    let lastMouseY = height / 2;

    // Interactive Pet Fish (Follows Mouse Cursor!)
    const petFish = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      tailAngle: 0,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      petFish.targetX = e.clientX + 35;
      petFish.targetY = e.clientY + 25;

      const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      if (dist > 10) {
        // Spawn shockwave ripple
        if (ripples.length < 20) {
          ripples.push({
            x: e.clientX,
            y: e.clientY,
            radius: 6,
            maxRadius: 80 + Math.random() * 30,
            opacity: 0.9,
          });
        }
        // Spawn trailing air bubble at cursor
        if (trailBubbles.length < 40) {
          trailBubbles.push({
            x: e.clientX + (Math.random() - 0.5) * 15,
            y: e.clientY + (Math.random() - 0.5) * 15,
            radius: Math.random() * 6 + 3,
            speedY: Math.random() * -2 - 1,
            speedX: (Math.random() - 0.5) * 1.5,
            opacity: 0.95,
          });
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Marine Snow / Plankton Particles
    const planktonCount = Math.min(130, Math.floor((width * height) / 6000));
    const plankton = [];
    for (let i = 0; i < planktonCount; i++) {
      plankton.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedY: Math.random() * -0.4 - 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.8 + 0.2,
      });
    }

    // 1. Hammerhead & Reef Sharks
    const sharks = [];
    const sharkCount = Math.min(3, Math.max(1, Math.floor(width / 450)));
    for (let i = 0; i < sharkCount; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      sharks.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.5) + height * 0.15,
        speed: (Math.random() * 1.5 + 1.2) * dir,
        scale: Math.random() * 0.3 + 0.6,
        dir: dir,
        tailPhase: Math.random() * Math.PI * 2,
        isHammerhead: i % 2 === 0,
      });
    }

    // 2. Playful Dolphins
    const dolphins = [];
    const dolphinCount = Math.min(2, Math.max(1, Math.floor(width / 600)));
    for (let i = 0; i < dolphinCount; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      dolphins.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.3) + height * 0.1,
        speed: (Math.random() * 2.0 + 1.5) * dir,
        scale: Math.random() * 0.25 + 0.65,
        dir: dir,
        arcPhase: Math.random() * Math.PI * 2,
      });
    }

    // 3. Realistic School of Reef Fish (Clownfish & Tropical Tangs)
    const fishSchool = [];
    const fishCount = Math.min(28, Math.floor(width / 45));
    for (let i = 0; i < fishCount; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const depth = Math.random() * 0.7 + 0.3;
      fishSchool.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7) + height * 0.15,
        speed: (Math.random() * 1.2 + 0.6) * dir * depth,
        length: (Math.random() * 16 + 18) * depth,
        height: (Math.random() * 8 + 9) * depth,
        depth: depth,
        dir: dir,
        tailAngle: Math.random() * Math.PI * 2,
        tailSpeed: Math.random() * 0.25 + 0.15,
        hue: i % 3 === 0 ? 30 : i % 3 === 1 ? 195 : 330, // Clownfish Orange, Blue Tang, Magenta
      });
    }

    // 4. Majestic Sea Turtles
    const turtles = [];
    const turtleCount = Math.min(2, Math.max(1, Math.floor(width / 500)));
    for (let i = 0; i < turtleCount; i++) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      turtles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.45) + height * 0.25,
        speed: (Math.random() * 0.6 + 0.4) * dir,
        scale: Math.random() * 0.25 + 0.5,
        dir: dir,
        flipperPhase: Math.random() * Math.PI * 2,
      });
    }

    // 5. Giant Manta Ray
    const mantaRay = {
      x: width * 0.1,
      y: height * 0.4,
      speed: 0.7,
      wingPhase: 0,
      scale: 0.9,
    };

    // 6. Seahorses Bobbing in Sea Kelp
    const seahorses = [];
    const seahorseCount = Math.min(4, Math.floor(width / 300));
    for (let i = 0; i < seahorseCount; i++) {
      seahorses.push({
        x: (i + 0.5) * (width / seahorseCount) + (Math.random() - 0.5) * 40,
        y: height - (Math.random() * 80 + 100),
        scale: Math.random() * 0.2 + 0.4,
        bobPhase: Math.random() * Math.PI * 2,
      });
    }

    // 7. Bioluminescent Jellyfish
    const jellies = [];
    const jellyCount = Math.min(5, Math.max(2, Math.floor(width / 300)));
    for (let i = 0; i < jellyCount; i++) {
      jellies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: Math.random() * -0.4 - 0.2,
        radius: Math.random() * 16 + 14,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Beach Activity Objects (For Top Beach Shore Zone)
    const surfer = { x: -100, speed: 1.8, boardColor: "#f59e0b" };
    const beachBall = { x: width * 0.45, y: height - 60, vy: -3, radius: 12, angle: 0 };
    const swimmers = [
      { x: width * 0.22, phase: 0, capColor: "#ec4899" },
      { x: width * 0.58, phase: 2.2, capColor: "#0284c7" },
      { x: width * 0.82, phase: 4.5, capColor: "#10b981" },
    ];

    // Flying Seagulls (For Top Beach Zone)
    const gulls = [];
    for (let i = 0; i < 3; i++) {
      gulls.push({
        x: Math.random() * width,
        y: Math.random() * 120 + 30,
        speed: Math.random() * 1.5 + 1.2,
        wingPhase: Math.random() * Math.PI * 2,
      });
    }

    // Gigantic Abyssal Blue Whale (For Bottom Abyss Zone)
    const blueWhale = {
      x: -300,
      y: height * 0.5,
      speed: 0.8,
      tailPhase: 0,
    };

    // Preload 8K Photorealistic Ocean Images
    let topLoaded = false;
    let middleLoaded = false;
    let bottomLoaded = false;

    const imgTop = new Image();
    imgTop.src = "/ocean_top.png";
    imgTop.onload = () => { topLoaded = true; };

    const imgMiddle = new Image();
    imgMiddle.src = "/ocean_middle.png";
    imgMiddle.onload = () => { middleLoaded = true; };

    const imgBottom = new Image();
    imgBottom.src = "/ocean_bottom.png";
    imgBottom.onload = () => { bottomLoaded = true; };

    let waveTime = 0;

    const renderRealOcean = () => {
      waveTime += 0.025;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Scroll Depth Progression (0.0 = Beach, 0.5 = Coral Reef, 1.0 = Abyssal Trench)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const depth = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 8K Photorealistic Ocean Background Image with Scroll Depth Blending
      ctx.save();
      if (depth < 0.35) {
        // Top Paradise Beach Image
        if (topLoaded || (imgTop.complete && imgTop.naturalWidth !== 0)) {
          ctx.drawImage(imgTop, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#0284c7";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Middle Coral Reef Image as depth increases
        if (depth > 0.15 && (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0))) {
          const alpha = (depth - 0.15) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        }
      } else if (depth < 0.7) {
        // Middle Coral Reef Image
        if (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0)) {
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#0369a1";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Bottom Deep Abyss Image as depth increases
        if (depth > 0.5 && (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0))) {
          const alpha = (depth - 0.5) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgBottom, 0, 0, width, height);
        }
      } else {
        // Bottom Deep Ocean Abyss Image
        if (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0)) {
          ctx.drawImage(imgBottom, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#075985";
          ctx.fillRect(0, 0, width, height);
        }
      }
      ctx.restore();

      // Vignette Overlay for Crisp White Text Legibility
      ctx.fillStyle = "rgba(12, 74, 110, 0.42)";
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // TOP REALISTIC TROPICAL BEACH SHORE (Active when depth < 0.25)
      // -------------------------------------------------------------
      if (depth < 0.25) {
        const beachAlpha = (1 - depth / 0.25);

        // Sun & Lens Flare Glow
        ctx.save();
        const sunGrad = ctx.createRadialGradient(width * 0.82, 70, 10, width * 0.82, 70, 200);
        sunGrad.addColorStop(0, `rgba(254, 240, 138, ${0.9 * beachAlpha})`);
        sunGrad.addColorStop(0.4, `rgba(251, 146, 60, ${0.4 * beachAlpha})`);
        sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.82, 70, 200, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Flying Seagulls
        ctx.save();
        gulls.forEach((g) => {
          g.x += g.speed;
          g.wingPhase += 0.1;
          if (g.x > width + 50) g.x = -50;

          const wingY = Math.sin(g.wingPhase) * 6;
          ctx.beginPath();
          ctx.moveTo(g.x - 12, g.y + wingY);
          ctx.quadraticCurveTo(g.x - 6, g.y - 8, g.x, g.y);
          ctx.quadraticCurveTo(g.x + 6, g.y - 8, g.x + 12, g.y + wingY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * beachAlpha})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        });
        ctx.restore();

        // Golden Sandy Beach Dunes at Shore Base
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 20; x += 25) {
          const sandY = height - 55 + Math.sin(x * 0.01 + waveTime * 1.2) * 10;
          ctx.lineTo(x, sandY);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(217, 119, 6, ${0.55 * beachAlpha})`;
        ctx.fill();

        // Rolling White Sea Foam Water Waves Crashing on Shore
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 20; x += 15) {
          const foamY = height - 65 + Math.sin(x * 0.02 + waveTime * 2.2) * 7;
          ctx.lineTo(x, foamY);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * beachAlpha})`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.fill();

        // Swaying Tropical Palm Tree Silhouettes at Shore Edges
        const palmSway = Math.sin(waveTime * 0.8) * 8;

        // Left Palm Tree
        ctx.beginPath();
        ctx.moveTo(20, height);
        ctx.quadraticCurveTo(45, height - 120, 60 + palmSway, height - 220); // Trunk
        ctx.strokeStyle = `rgba(120, 53, 15, ${0.8 * beachAlpha})`;
        ctx.lineWidth = 14;
        ctx.stroke();

        // Left Palm Fronds (Leaves)
        const palmX = 60 + palmSway;
        const palmY = height - 220;
        ctx.fillStyle = `rgba(21, 128, 61, ${0.85 * beachAlpha})`;
        for (let f = 0; f < 5; f++) {
          const angle = (f / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(palmX, palmY);
          ctx.quadraticCurveTo(palmX + Math.cos(angle) * 50, palmY + Math.sin(angle) * 50 + 20, palmX + Math.cos(angle) * 75, palmY + Math.sin(angle) * 75);
          ctx.lineWidth = 6;
          ctx.strokeStyle = `rgba(21, 128, 61, ${0.85 * beachAlpha})`;
          ctx.stroke();
        }

        // 1. People Swimming & Bathing in Shallow Shore Water
        swimmers.forEach((s) => {
          s.phase += 0.05;
          const headY = height - 52 + Math.sin(s.phase) * 5;
          // Water Splash Ring
          ctx.beginPath();
          ctx.arc(s.x, headY + 5, 12 + Math.sin(s.phase * 2) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * beachAlpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Swimmer Head & Swim Cap
          ctx.beginPath();
          ctx.arc(s.x, headY, 7.5, 0, Math.PI * 2);
          ctx.fillStyle = s.capColor;
          ctx.fill();

          // Swimmer Arms Splashing
          ctx.beginPath();
          ctx.arc(s.x + Math.cos(s.phase) * 10, headY - Math.abs(Math.sin(s.phase)) * 7, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#fef08a";
          ctx.fill();
        });

        // 2. Surfer Riding Wave Across Shore
        surfer.x += surfer.speed;
        if (surfer.x > width + 100) surfer.x = -100;
        const surfY = height - 60 + Math.sin(surfer.x * 0.02 + waveTime * 2) * 6;

        ctx.save();
        ctx.translate(surfer.x, surfY);
        // Surfboard
        ctx.beginPath();
        ctx.ellipse(0, 4, 26, 5.5, -0.08, 0, Math.PI * 2);
        ctx.fillStyle = surfer.boardColor;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Surfer Silhouette
        ctx.beginPath();
        ctx.arc(0, -20, 5.5, 0, Math.PI * 2); // Head
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -145);
        ctx.lineTo(-4, 0); // Legs/Body
        ctx.lineTo(5, 0);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // 3. Colorful Bouncing Beach Ball
        beachBall.angle += 0.06;
        beachBall.y += beachBall.vy;
        beachBall.vy += 0.16; // gravity
        if (beachBall.y > height - 48) {
          beachBall.y = height - 48;
          beachBall.vy = -4.5; // bounce
        }

        ctx.save();
        ctx.translate(beachBall.x, beachBall.y);
        ctx.rotate(beachBall.angle);
        ctx.beginPath();
        ctx.arc(0, 0, beachBall.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, beachBall.radius, 0, Math.PI);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, beachBall.radius, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // ABYSSAL OCEAN TRENCH FLOOR (Active when depth > 0.65)
      // -------------------------------------------------------------
      if (depth > 0.65) {
        const abyssAlpha = (depth - 0.65) / 0.35;

        // Abyssal Sand Floor
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width + 20; x += 40) {
          const trenchY = height - 70 + Math.sin(x * 0.008 + waveTime * 0.5) * 15;
          ctx.lineTo(x, trenchY);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(2, 6, 23, ${0.9 * abyssAlpha})`;
        ctx.fill();

        // Bioluminescent Deep Sea Vents
        for (let v = 0; v < 3; v++) {
          const ventX = (v + 0.5) * (width / 3);
          const ventGrad = ctx.createRadialGradient(ventX, height - 30, 5, ventX, height - 30, 80);
          ventGrad.addColorStop(0, `rgba(56, 189, 248, ${0.6 * abyssAlpha})`);
          ventGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = ventGrad;
          ctx.beginPath();
          ctx.arc(ventX, height - 30, 80, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Gigantic Blue Whale (Gliding across dark abyss bottom)
        ctx.save();
        blueWhale.x += blueWhale.speed;
        blueWhale.tailPhase += 0.03;
        if (blueWhale.x > width + 400) blueWhale.x = -400;

        ctx.translate(blueWhale.x, height * 0.55 + Math.sin(waveTime * 0.5) * 20);
        const whaleTail = Math.sin(blueWhale.tailPhase) * 14;

        // Massive Blue Whale Silhouette
        ctx.beginPath();
        ctx.moveTo(180, 0); // Snout
        ctx.quadraticCurveTo(80, -70, -120, -20); // Back
        ctx.lineTo(-240, -40 + whaleTail); // Fluke top
        ctx.quadraticCurveTo(-190, 0, -240, 40 + whaleTail); // Fluke bottom
        ctx.lineTo(-120, 20);
        ctx.quadraticCurveTo(80, 70, 180, 0); // Belly
        ctx.closePath();

        const whaleGrad = ctx.createLinearGradient(-200, 0, 180, 0);
        whaleGrad.addColorStop(0, `rgba(15, 23, 42, ${0.9 * abyssAlpha})`);
        whaleGrad.addColorStop(0.5, `rgba(30, 58, 138, ${0.8 * abyssAlpha})`);
        whaleGrad.addColorStop(1, `rgba(56, 189, 248, ${0.6 * abyssAlpha})`);

        ctx.fillStyle = whaleGrad;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.restore();
      }

      // 2. Mouse Underwater Torchlight Spotlight Halo
      ctx.save();
      const torchGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 280);
      torchGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
      torchGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.15)");
      torchGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = torchGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Interactive Expanding Water Ripples
      ctx.save();
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 3.0;
        rip.opacity -= 0.025;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rip.opacity})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.restore();

      // 4. Interactive Trailing Air Bubbles (Emitted directly at cursor location)
      ctx.save();
      for (let b = trailBubbles.length - 1; b >= 0; b--) {
        const tb = trailBubbles[b];
        tb.y += tb.speedY;
        tb.x += tb.speedX;
        tb.opacity -= 0.018;

        if (tb.opacity <= 0) {
          trailBubbles.splice(b, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(tb.x, tb.y, tb.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${tb.opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${tb.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // 5. Interactive Marine Ecosystem (Rendered ONLY Underwater when depth > 0.18)
      if (depth > 0.18) {
        const marineAlpha = Math.min(1, (depth - 0.18) / 0.15);
        ctx.save();
        ctx.globalAlpha = marineAlpha;

        // Interactive Pet Fish (Cursor Companion!)
        ctx.save();
      petFish.x += (petFish.targetX - petFish.x) * 0.12;
      petFish.y += (petFish.targetY - petFish.y) * 0.12;
      petFish.tailAngle += 0.2;

      ctx.translate(petFish.x, petFish.y);
      const petDx = mouse.targetX - petFish.x;
      if (petDx < 0) ctx.scale(-1, 1);

      const petTailWiggle = Math.sin(petFish.tailAngle) * 6;

      // Pet Fish Body
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#00f2fe";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 18;
      ctx.fill();

      // Pet Fish Eye
      ctx.beginPath();
      ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -2, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // Pet Tail Fin
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-20, -8 + petTailWiggle);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-20, 8 + petTailWiggle);
      ctx.closePath();
      ctx.fillStyle = "#ff007f";
      ctx.fill();

      ctx.restore();

      // 4. Volumetric Sunlight Rays from Top
      ctx.save();
      for (let i = 0; i < 6; i++) {
        const rayX = (i + 0.4) * (width / 5.5) + Math.sin(waveTime * 0.6 + i * 1.2) * 45;
        const rayWidth = 140 + Math.cos(waveTime * 0.5 + i) * 30;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 90, height);
        rayGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
        rayGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.09)");
        rayGrad.addColorStop(1, "rgba(2, 18, 38, 0)");

        ctx.beginPath();
        ctx.moveTo(rayX - rayWidth / 2, 0);
        ctx.lineTo(rayX + rayWidth * 0.8, height);
        ctx.lineTo(rayX + rayWidth * 0.2, height);
        ctx.lineTo(rayX - rayWidth * 0.8, 0);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.restore();

      // 5. Swimming Dolphins (Top Layer)
      ctx.save();
      dolphins.forEach((d) => {
        d.x += d.speed;
        d.arcPhase += 0.03;

        // Flee from Mouse
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        if (Math.hypot(dx, dy) < 140) {
          d.x += dx * 0.05;
        }

        if (d.dir > 0 && d.x > width + 120) d.x = -120;
        if (d.dir < 0 && d.x < -120) d.x = width + 120;

        ctx.save();
        ctx.translate(d.x, d.y + Math.sin(d.arcPhase) * 20);
        ctx.scale(d.scale * (d.dir < 0 ? -1 : 1), d.scale);

        // Dolphin Streamlined Body
        ctx.beginPath();
        ctx.moveTo(60, 0); // Snout
        ctx.quadraticCurveTo(20, -28, -40, -5); // Back
        ctx.quadraticCurveTo(-70, 0, -85, -12); // Fluke upper
        ctx.quadraticCurveTo(-75, 0, -85, 12); // Fluke lower
        ctx.quadraticCurveTo(-40, 5, 20, 20); // Belly
        ctx.closePath();

        const dolGrad = ctx.createLinearGradient(-40, -20, 40, 20);
        dolGrad.addColorStop(0, "#38bdf8");
        dolGrad.addColorStop(0.6, "#0284c7");
        dolGrad.addColorStop(1, "#0369a1");
        ctx.fillStyle = dolGrad;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 15;
        ctx.fill();

        // Dorsal Fin
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.quadraticCurveTo(-15, -45, -25, -20);
        ctx.fillStyle = "#0284c7";
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 6. Swimming Hammerhead & Reef Sharks
      ctx.save();
      sharks.forEach((s) => {
        s.x += s.speed;
        s.tailPhase += 0.05;

        // Mouse Fleeing Physics
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        if (Math.hypot(dx, dy) < 150) {
          s.x += dx * 0.04;
          s.y += dy * 0.04;
        }

        if (s.dir > 0 && s.x > width + 150) s.x = -150;
        if (s.dir < 0 && s.x < -150) s.x = width + 150;

        ctx.save();
        ctx.translate(s.x, s.y + Math.sin(s.tailPhase) * 6);
        ctx.scale(s.scale * (s.dir < 0 ? -1 : 1), s.scale);

        const tailWiggle = Math.sin(s.tailPhase) * 12;

        // Shark Body
        ctx.beginPath();
        if (s.isHammerhead) {
          // Hammerhead Head T-shape
          ctx.moveTo(70, -18);
          ctx.lineTo(70, 18);
          ctx.lineTo(55, 12);
        } else {
          ctx.moveTo(75, 0); // Pointed nose
        }
        ctx.quadraticCurveTo(20, -30, -50, -8); // Back line
        ctx.lineTo(-95, -35 + tailWiggle); // Tail fin top
        ctx.quadraticCurveTo(-75, 0, -95, 25 + tailWiggle); // Tail fin bottom
        ctx.lineTo(-50, 8);
        ctx.quadraticCurveTo(20, 28, 55, -12); // Belly line
        ctx.closePath();

        const sharkGrad = ctx.createLinearGradient(-50, 0, 70, 0);
        sharkGrad.addColorStop(0, "#334155");
        sharkGrad.addColorStop(0.5, "#475569");
        sharkGrad.addColorStop(1, "#1e293b");

        ctx.fillStyle = sharkGrad;
        ctx.shadowColor = "#0284c7";
        ctx.shadowBlur = 14;
        ctx.fill();

        // Dorsal Fin
        ctx.beginPath();
        ctx.moveTo(10, -25);
        ctx.lineTo(-10, -55);
        ctx.lineTo(-25, -20);
        ctx.closePath();
        ctx.fillStyle = "#334155";
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 7. Giant Manta Ray (Distant Glider)
      ctx.save();
      mantaRay.x += mantaRay.speed;
      mantaRay.wingPhase += 0.035;
      if (mantaRay.x > width + 180) mantaRay.x = -180;

      ctx.translate(mantaRay.x, mantaRay.y + Math.sin(waveTime * 0.8) * 15);
      const wingWave = Math.sin(mantaRay.wingPhase) * 18;

      ctx.beginPath();
      ctx.moveTo(70, 0);
      ctx.quadraticCurveTo(20, -55 + wingWave, -40, -10);
      ctx.quadraticCurveTo(-50, 0, -40, 10);
      ctx.quadraticCurveTo(20, 55 - wingWave, 70, 0);
      ctx.closePath();

      const mantaGrad = ctx.createLinearGradient(-40, 0, 70, 0);
      mantaGrad.addColorStop(0, "rgba(8, 47, 73, 0.4)");
      mantaGrad.addColorStop(0.5, "rgba(14, 116, 144, 0.55)");
      mantaGrad.addColorStop(1, "rgba(2, 132, 199, 0.3)");

      ctx.fillStyle = mantaGrad;
      ctx.shadowColor = "#0284c7";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // 8. Sea Turtles (Medium Layer)
      ctx.save();
      turtles.forEach((t) => {
        t.x += t.speed;
        t.flipperPhase += 0.04;

        // Flee from Mouse
        const dx = t.x - mouse.x;
        const dy = t.y - mouse.y;
        if (Math.hypot(dx, dy) < 130) {
          t.x += dx * 0.03;
        }

        if (t.dir > 0 && t.x > width + 100) t.x = -100;
        if (t.dir < 0 && t.x < -100) t.x = width + 100;

        ctx.save();
        ctx.translate(t.x, t.y + Math.sin(waveTime + t.flipperPhase) * 8);
        ctx.scale(t.scale * (t.dir < 0 ? -1 : 1), t.scale);

        // Shell
        const shellGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 32);
        shellGrad.addColorStop(0, "#0f766e");
        shellGrad.addColorStop(0.6, "#042f2e");
        shellGrad.addColorStop(1, "#021a19");

        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
        ctx.fillStyle = shellGrad;
        ctx.strokeStyle = "rgba(45, 212, 191, 0.5)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#14b8a6";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(38, 0, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#0d9488";
        ctx.fill();

        // Flippers
        const flap = Math.sin(t.flipperPhase) * 16;
        ctx.beginPath();
        ctx.moveTo(18, -10);
        ctx.quadraticCurveTo(35, -38 + flap, 10, -45 + flap);
        ctx.quadraticCurveTo(0, -35, 10, -10);
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(18, 10);
        ctx.quadraticCurveTo(35, 38 - flap, 10, 45 - flap);
        ctx.quadraticCurveTo(0, 35, 10, 10);
        ctx.closePath();

        ctx.fillStyle = "#0f766e";
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 9. Seahorses Bobbing in Sea Kelp
      ctx.save();
      seahorses.forEach((sh) => {
        sh.bobPhase += 0.03;
        const bobY = Math.sin(sh.bobPhase) * 10;

        ctx.save();
        ctx.translate(sh.x, sh.y + bobY);
        ctx.scale(sh.scale, sh.scale);

        // Seahorse Head & Curved Body
        ctx.beginPath();
        ctx.arc(0, -25, 8, 0, Math.PI * 2); // Head
        ctx.moveTo(0, -17);
        ctx.quadraticCurveTo(12, -5, 0, 15); // Curved belly
        ctx.quadraticCurveTo(-15, 30, -5, 45); // Tail curl
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.stroke();

        ctx.restore();
      });
      ctx.restore();

      // 10. Fish School (Clownfish & Tropical Tangs - Fleeing Mouse Reaction)
      ctx.save();
      fishSchool.forEach((f) => {
        f.x += f.speed;
        f.tailAngle += f.tailSpeed;

        // Fleeing mouse interaction
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const force = ((130 - dist) / 130) * 4.5;
          f.x += (dx / dist) * force;
          f.y += (dy / dist) * force;
        }

        if (f.dir > 0 && f.x > width + 50) f.x = -50;
        if (f.dir < 0 && f.x < -50) f.x = width + 50;

        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.dir < 0) ctx.scale(-1, 1);

        const tailWiggle = Math.sin(f.tailAngle) * 0.4;
        const opacity = f.depth * 0.85;

        // Fish Body
        ctx.beginPath();
        ctx.moveTo(f.length * 0.5, 0);
        ctx.quadraticCurveTo(0, -f.height * 0.7, -f.length * 0.4, 0);
        ctx.quadraticCurveTo(0, f.height * 0.7, f.length * 0.5, 0);
        ctx.closePath();

        const bodyGrad = ctx.createLinearGradient(-f.length * 0.4, 0, f.length * 0.5, 0);
        bodyGrad.addColorStop(0, `hsla(${f.hue}, 85%, 60%, ${opacity * 0.7})`);
        bodyGrad.addColorStop(0.5, `hsla(${f.hue}, 90%, 75%, ${opacity})`);
        bodyGrad.addColorStop(1, `hsla(${f.hue}, 100%, 85%, ${opacity})`);

        ctx.fillStyle = bodyGrad;
        ctx.shadowColor = `hsl(${f.hue}, 90%, 65%)`;
        ctx.shadowBlur = 10 * f.depth;
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.arc(f.length * 0.3, -f.height * 0.15, f.height * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Tail Fin
        ctx.beginPath();
        ctx.moveTo(-f.length * 0.4, 0);
        ctx.lineTo(-f.length * 0.85, -f.height * 0.7 + tailWiggle * 8);
        ctx.quadraticCurveTo(-f.length * 0.65, 0, -f.length * 0.85, f.height * 0.7 + tailWiggle * 8);
        ctx.closePath();
        ctx.fillStyle = `hsla(${f.hue}, 85%, 55%, ${opacity * 0.9})`;
        ctx.fill();

        ctx.restore();
      });
      ctx.restore();

      // 11. Bioluminescent Jellyfish
      ctx.save();
      jellies.forEach((j) => {
        j.pulse += 0.035;
        j.y += j.speedY;

        if (j.y < -60) {
          j.y = height + 60;
          j.x = Math.random() * width;
        }

        const pulseCap = Math.sin(j.pulse) * 4;
        ctx.save();
        ctx.translate(j.x, j.y);

        ctx.beginPath();
        ctx.ellipse(0, 0, j.radius + pulseCap, (j.radius + pulseCap) * 0.75, 0, Math.PI, 0, false);
        const jellyGrad = ctx.createRadialGradient(0, -j.radius * 0.3, 2, 0, 0, j.radius);
        jellyGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        jellyGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.65)");
        jellyGrad.addColorStop(1, "rgba(14, 165, 233, 0.15)");

        ctx.fillStyle = jellyGrad;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 22;
        ctx.fill();

        // Tentacles
        for (let t = -4; t <= 4; t++) {
          ctx.beginPath();
          ctx.moveTo(t * 3.2, 0);
          const waveX = Math.sin(j.pulse * 2.2 + t * 0.6) * 7;
          ctx.quadraticCurveTo(t * 3 + waveX, j.radius * 1.4, t * 2, j.radius * 2.5);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      });
      ctx.restore();

      ctx.restore(); // Close globalAlpha marine ecosystem save
    } // Close if (depth > 0.18)

      // 12. Plankton & Marine Snow Particles
      ctx.save();
      plankton.forEach((p) => {
        p.wobble += 0.03;
        p.y += p.speedY;
        p.x += Math.sin(p.wobble) * 0.4 + p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${p.opacity * p.depth})`;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8 * p.depth;
        ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(renderRealOcean);
    };

    renderRealOcean();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // 4. HYPER-REALISTIC PHOTOREALISTIC ENCHANTED FOREST (For Forest Theme)
  useEffect(() => {
    if (theme !== "forest") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Preload 8K Photorealistic Forest Images
    let topLoaded = false;
    let middleLoaded = false;
    let bottomLoaded = false;

    const imgTop = new Image();
    imgTop.src = "/forest_top.png";
    imgTop.onload = () => { topLoaded = true; };

    const imgMiddle = new Image();
    imgMiddle.src = "/forest_middle.png";
    imgMiddle.onload = () => { middleLoaded = true; };

    const imgBottom = new Image();
    imgBottom.src = "/forest_bottom.png";
    imgBottom.onload = () => { bottomLoaded = true; };

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const ripples = [];
    const trailSpores = [];
    let lastMouseX = width / 2;
    let lastMouseY = height / 2;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
      if (dist > 15) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 8,
          maxRadius: Math.random() * 25 + 25,
          opacity: 0.85,
        });

        for (let i = 0; i < 2; i++) {
          trailSpores.push({
            x: e.clientX + (Math.random() - 0.5) * 16,
            y: e.clientY + (Math.random() - 0.5) * 16,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * -1.2 - 0.5,
            radius: Math.random() * 2.5 + 1.5,
            opacity: 0.9,
            hue: Math.random() > 0.5 ? 140 : 45,
          });
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Pet Firefly Companion
    const petFirefly = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      glowPhase: 0,
      wingAngle: 0,
    };

    // Fluttering Butterflies
    const butterflies = [];
    for (let i = 0; i < 8; i++) {
      butterflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedX: (Math.random() * 1.2 + 0.6) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() - 0.5) * 0.8,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: Math.random() * 0.2 + 0.15,
        color: i % 2 === 0 ? "#f97316" : "#38bdf8",
        size: Math.random() * 5 + 6,
      });
    }

    // Glowing Fireflies
    const fireflies = [];
    for (let i = 0; i < 30; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        radius: Math.random() * 2.5 + 2,
        hue: Math.random() > 0.5 ? 130 : 50,
      });
    }

    let forestTime = 0;

    const renderRealForest = () => {
      forestTime += 0.025;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      petFirefly.targetX = mouse.x - 30;
      petFirefly.targetY = mouse.y - 25;

      ctx.clearRect(0, 0, width, height);

      // Scroll Depth Progression (0.0 = Top Canopy, 0.5 = Mid Jungle, 1.0 = Mystical Floor)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const depth = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // 1. Draw Photorealistic Background Image with Scroll Altitude Blending
      ctx.save();
      if (depth < 0.35) {
        // Top Canopy Image
        if (topLoaded || (imgTop.complete && imgTop.naturalWidth !== 0)) {
          ctx.drawImage(imgTop, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#022c22";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Middle Image as depth increases
        if (depth > 0.15 && (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0))) {
          const alpha = (depth - 0.15) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        }
      } else if (depth < 0.7) {
        // Middle Jungle Image
        if (middleLoaded || (imgMiddle.complete && imgMiddle.naturalWidth !== 0)) {
          ctx.drawImage(imgMiddle, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#01261c";
          ctx.fillRect(0, 0, width, height);
        }

        // Blend with Bottom Image as depth increases
        if (depth > 0.5 && (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0))) {
          const alpha = (depth - 0.5) / 0.2;
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx.drawImage(imgBottom, 0, 0, width, height);
        }
      } else {
        // Bottom Mystical Forest Floor Image
        if (bottomLoaded || (imgBottom.complete && imgBottom.naturalWidth !== 0)) {
          ctx.drawImage(imgBottom, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#01140e";
          ctx.fillRect(0, 0, width, height);
        }
      }
      ctx.restore();

      // Ambient Dark Vignette Overlay for High Text Readability
      ctx.fillStyle = "rgba(2, 28, 21, 0.45)";
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Warm Golden Lantern Spotlight Halo
      ctx.save();
      const lanternGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 280);
      lanternGrad.addColorStop(0, "rgba(250, 204, 21, 0.25)");
      lanternGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.12)");
      lanternGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = lanternGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Interactive Expanding Magic Spore Rings
      ctx.save();
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 2.5;
        rip.opacity -= 0.025;
        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${rip.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 12;
        ctx.stroke();
      }
      ctx.restore();

      // 4. Mouse Trailing Spores
      ctx.save();
      for (let s = trailSpores.length - 1; s >= 0; s--) {
        const sp = trailSpores[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.opacity -= 0.02;

        if (sp.opacity <= 0) {
          trailSpores.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${sp.hue}, 90%, 65%, ${sp.opacity})`;
        ctx.shadowColor = `hsl(${sp.hue}, 90%, 65%)`;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      // 5. Pet Firefly Companion
      ctx.save();
      petFirefly.x += (petFirefly.targetX - petFirefly.x) * 0.12;
      petFirefly.y += (petFirefly.targetY - petFirefly.y) * 0.12;
      petFirefly.glowPhase += 0.08;
      petFirefly.wingAngle += 0.3;

      ctx.translate(petFirefly.x, petFirefly.y);
      const ffGlow = Math.sin(petFirefly.glowPhase) * 6 + 18;

      const ffGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, ffGlow);
      ffGrad.addColorStop(0, "rgba(250, 204, 21, 1)");
      ffGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.7)");
      ffGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = ffGrad;
      ctx.beginPath();
      ctx.arc(0, 0, ffGlow, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fef08a";
      ctx.fill();

      const wingWobble = Math.sin(petFirefly.wingAngle) * 5;
      ctx.beginPath();
      ctx.ellipse(-2, -4 + wingWobble, 6, 2.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(2, -4 + wingWobble, 6, 2.5, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();
      ctx.restore();

      // 6. Fluttering Butterflies
      ctx.save();
      butterflies.forEach((bf) => {
        bf.x += bf.speedX;
        bf.y += Math.sin(forestTime * 2 + bf.wingPhase) * 1.5 + bf.speedY;
        bf.wingPhase += bf.wingSpeed;

        if (bf.x > width + 50) bf.x = -50;
        if (bf.x < -50) bf.x = width + 50;

        ctx.save();
        ctx.translate(bf.x, bf.y);
        const wingFlap = Math.abs(Math.sin(bf.wingPhase)) * bf.size;

        ctx.beginPath();
        ctx.ellipse(-wingFlap * 0.5, 0, wingFlap, bf.size, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = bf.color;
        ctx.shadowColor = bf.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(wingFlap * 0.5, 0, wingFlap, bf.size, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = bf.color;
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // 7. Bioluminescent Fireflies
      ctx.save();
      fireflies.forEach((ff) => {
        ff.x += ff.vx;
        ff.y += ff.vy;
        ff.pulse += ff.pulseSpeed;

        if (ff.x < 0 || ff.x > width) ff.vx *= -1;
        if (ff.y < 0 || ff.y > height) ff.vy *= -1;

        const alpha = (Math.sin(ff.pulse) + 1) * 0.4 + 0.2;
        const ffGrad = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.radius * 4);
        ffGrad.addColorStop(0, `hsla(${ff.hue}, 90%, 65%, ${alpha})`);
        ffGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = ffGrad;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${ff.hue}, 100%, 80%, ${alpha})`;
        ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(renderRealForest);
    };

    renderRealForest();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <>
      {theme === "cyber" ? (
        <div
          ref={vantaContainerRef}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: -1,
            transition: "opacity 0.5s ease",
          }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: -1,
            pointerEvents: "none",
            transition: "opacity 0.5s ease",
          }}
        />
      )}
    </>
  );
}
