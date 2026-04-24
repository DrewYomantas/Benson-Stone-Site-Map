export function SceneLighting() {
  return (
    <>
      <color attach="background" args={['#1a1814']} />
      <ambientLight color="#836f57" intensity={0.52} />

      <directionalLight
        color="#fff1de"
        intensity={2.05}
        position={[22, 30, 16]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={140}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-bias={-0.0008}
      />

      <directionalLight color="#d4dde8" intensity={0.24} position={[-18, 12, -10]} />
      <hemisphereLight args={['#c6b39a', '#241d18', 0.44]} />

      <spotLight
        color="#f3cf96"
        intensity={0.45}
        angle={0.48}
        penumbra={0.6}
        distance={90}
        position={[10, 18, 24]}
        target-position={[12, 0, 4]}
      />
    </>
  )
}
