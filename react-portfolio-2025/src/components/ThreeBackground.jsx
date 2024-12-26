import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    //Create star for backgound
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPosition = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPosition[i] = (Math.random() - 0.5) * 100; // Spread stars over large area;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPosition, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Make star move and interact with the mouse (parallax effect)
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      camera.position.x += mouseX * 0.01;
      camera.position.y += mouseY * 0.01;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Handle window resize for responsiveness
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    //Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.x += 0.001; // Slow retation for movement
      starField.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return(
    <div ref={mountRef} className="fixed inset-0 -z-1 w-full h-full" />
  )
}
