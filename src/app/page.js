import Hero from '@/components/home/Hero'
import FeaturedVehicles from '@/components/home/FeaturedVehicles'
import FeatureShowcase from '@/components/demo/FeatureShowcase'
import SystemSpecs from '@/components/demo/SystemSpecs'
import DemoCredentials from '@/components/demo/DemoCredentials'

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureShowcase />
      <SystemSpecs />
      <FeaturedVehicles />
      <DemoCredentials />
    </>
  )
}