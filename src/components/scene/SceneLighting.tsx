export function SceneLighting() {
  return (
    <>
      {/* Warm ambient — fills shadows with stone warmth */}
      <ambientLight color="#7a6a50" intensity={0.55} />

      {/* Primary sun — upper-right, warm daylight */}
      <directionalLight
        color="#fff5e8"
        intensity={1.9}
        position={[20, 30, 12]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.001}
      />

      {/* Sky/ground hemisphere — warm sky, cool dark ground */}
      <hemisphereLight args={['#b0a090', '#2a2018', 0.35]} />

      {/* Cool fill from the north-west — keeps shadows from going fully black */}
      <directionalLight
        color="#c8d8e0"
        intensity={0.25}
        position={[-15, 10, -8]}
      />
    </>
  )
}
