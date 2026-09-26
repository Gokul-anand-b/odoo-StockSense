/**
 * StockSense — 3D Auth Background Scene
 *
 * Ultra-high-performance pure Three.js 3D WebGL background:
 *   - Floating geometric wireframes (Icosahedron, Torus, Octahedron)
 *   - 800-point stellar particle cloud with rotational drift
 *   - Infinite perspective grid floor
 *   - Subtle interactive mouse parallax with lerp damping
 *   - Bulletproof React 19 & Next.js 15 compatibility (Zero R3F reconciler crashes)
 *   - Graceful WebGL fallback
 */

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AuthBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer;

    try {
      // ── 1. Scene, Camera & Renderer ──
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.04);

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 8);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x050505, 1);

      // Append canvas
      container.appendChild(renderer.domElement);

      // ── 2. Particle Field ──
      const particleCount = 800;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 35;
        posArray[i + 1] = (Math.random() - 0.5) * 35;
        posArray[i + 2] = (Math.random() - 0.5) * 35;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });

      const particleMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particleMesh);

      // ── 3. Floating Geometries ──
      // Central Wireframe Icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      icoMesh.position.set(-2.5, 1.2, -2);
      scene.add(icoMesh);

      // Orbiting Torus
      const torusGeo = new THREE.TorusGeometry(1.4, 0.08, 16, 64);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      });
      const torusMesh = new THREE.Mesh(torusGeo, torusMat);
      torusMesh.position.set(3, -0.8, -3);
      scene.add(torusMesh);

      // Background Octahedron
      const octaGeo = new THREE.OctahedronGeometry(1.2, 0);
      const octaMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      });
      const octaMesh = new THREE.Mesh(octaGeo, octaMat);
      octaMesh.position.set(1.5, 2.5, -6);
      scene.add(octaMesh);

      // ── 4. Perspective Grid Floor ──
      const gridHelper = new THREE.GridHelper(60, 60, 0x333333, 0x111111);
      gridHelper.position.set(0, -4.5, 0);
      scene.add(gridHelper);

      // ── 5. Ambient & Directional Light ──
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      // ── 6. Mouse Interaction with Smooth Interpolation ──
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // ── 7. Resize Handler ──
      const handleResize = () => {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener('resize', handleResize);

      // ── 8. Animation Loop ──
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Parallax damping
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        camera.position.x = targetX * 1.5;
        camera.position.y = -targetY * 1.5;
        camera.lookAt(0, 0, 0);

        // Rotate particles
        particleMesh.rotation.y = elapsedTime * 0.02;
        particleMesh.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

        // Animate geometries
        icoMesh.rotation.x = elapsedTime * 0.15;
        icoMesh.rotation.y = elapsedTime * 0.2;
        icoMesh.position.y = 1.2 + Math.sin(elapsedTime * 0.8) * 0.25;

        torusMesh.rotation.x = elapsedTime * 0.2;
        torusMesh.rotation.y = elapsedTime * 0.15;
        torusMesh.position.y = -0.8 + Math.cos(elapsedTime * 0.6) * 0.2;

        octaMesh.rotation.y = elapsedTime * 0.25;
        octaMesh.rotation.z = elapsedTime * 0.1;

        renderer.render(scene, camera);
      };

      animate();

      // ── Cleanup ──
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }

        // Dispose geometries & materials
        particleGeo.dispose();
        particleMat.dispose();
        icoGeo.dispose();
        icoMat.dispose();
        torusGeo.dispose();
        torusMat.dispose();
        octaGeo.dispose();
        octaMat.dispose();
      };
    } catch (err) {
      console.warn('Three.js initialization skipped, falling back to CSS background:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050505',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
}
