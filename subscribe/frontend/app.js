// app.js - frontend logic
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('emailInput');
  const joinBtn = document.getElementById('joinBtn');
  const msg = document.getElementById('message');

  let cooldown = false;

  joinBtn.addEventListener('click', async () => {
    if (cooldown) return showMessage('Please wait a moment...', 'warn');
    const email = emailInput.value.trim();
    if (!validateEmail(email)) return showMessage('Invalid email address', 'error');
    // UI feedback
    joinBtn.classList.add('glow');
    showLoader(joinBtn, true);
    showMessage('Sending confirmation email...', 'info');

    // small 3D pulse on click
    triggerPulse();

    cooldown = true;
    setTimeout(()=> cooldown = false, 6000);

    try {
      // Assuming backend is running on same host or proxied. 
      // If running separate port locally, use http://localhost:4001/api/subscribe
      const res = await fetch('/api/subscribe', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email, source: 'alpha_signup' })
      });
      const json = await res.json();
      if (res.ok) {
        showMessage('Check your inbox — confirm to activate (double opt-in) ✅', 'success');
        emailInput.value = '';
      } else {
        showMessage(json?.error || 'Subscription failed', 'error');
      }
    } catch(e){
      showMessage('Network error — try again later', 'error');
      console.error(e);
    } finally {
      joinBtn.classList.remove('glow');
      showLoader(joinBtn, false);
    }
  });

  function validateEmail(s){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  function showMessage(text, type){
    msg.textContent = text;
    if (type === 'success') msg.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success') || '#00ffb3';
    else if (type === 'error') msg.style.color = getComputedStyle(document.documentElement).getPropertyValue('--danger') || '#ff6b6b';
    else if (type === 'warn') msg.style.color = '#ffd166';
    else msg.style.color = '#07f8ff';
  }

  function showLoader(btn, on){
    // create single loader bar element if missing
    let loader = btn.querySelector('.loader');
    if (!loader){
      loader = document.createElement('div'); loader.className = 'loader';
      loader.style.opacity = 0; loader.style.transform = 'scaleX(0)';
      btn.appendChild(loader);
    }
    if (on){
      loader.style.opacity = 1; loader.style.transform = 'scaleX(1)'; loader.style.transition = 'transform 1.2s linear';
    } else {
      loader.style.opacity = 0; loader.style.transform = 'scaleX(0)';
    }
  }

  // ------------------ 3D pulse (Three.js) ------------------
  function triggerPulse(){
    // Instantiate a small Three.js pulse sphere that expands and fades
    const wrap = document.getElementById('canvasWrap');
    if (!wrap) return;
    // lazy init scene per click
    if (!window._pulseInit){
      initPulseScene(wrap);
      window._pulseInit = true;
    }
    // create a small sprite that emits and fades
    const scene = window._pulseScene;
    const THREE = window.THREE;
    const geo = new THREE.SphereGeometry(0.4, 16, 12);
    const mat = new THREE.MeshBasicMaterial({ color: 0x07f8ff, transparent:true, opacity:0.85, wireframe: true });
    const s = new THREE.Mesh(geo, mat);
    s.position.set(0, 0, 0);
    scene.add(s);
    // animate scale+fade
    const start = performance.now();
    (function tick(){
      const t = (performance.now() - start) / 800;
      if (!s.material) { scene.remove(s); return; }
      s.scale.setScalar(1 + t * 8);
      s.rotation.y += 0.1;
      s.rotation.z += 0.05;
      s.material.opacity = Math.max(0, 0.85 - t*1.6);
      if (t < 1.2) requestAnimationFrame(tick);
      else scene.remove(s);
    })();
  }

  function initPulseScene(container){
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    // ambient glow
    const light = new THREE.PointLight(0x44eeff, 2, 20);
    light.position.set(2, 2, 5); scene.add(light);
    
    // store
    window._pulseScene = scene; window._pulseRenderer = renderer; window.THREE = THREE; window._pulseCamera = camera;
    // animate render loop
    (function animate(){
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    })();
  }

});