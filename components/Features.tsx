import React from 'react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

function Features() {
  return (
    <div>
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Discover Our Collections</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Explore our curated categories of sustainable products designed to enhance your living space
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Indoor Plants", image: "/assets/indoor_plants.png", description: "Perfect for purifying air and adding natural beauty" },
              { title: "Outdoor Plants", image: "/assets/outdoor_plants.png", description: "Transform your garden into a vibrant ecosystem" },
              { title: "Eco-friendly Planters", image: "/assets/eco-friendly-features.png", description: "Sustainable containers for your green companions" },
              { title: "Green Essentials", image: "/assets/green_essentials_oil.png", description: "Plant-based products for a sustainable lifestyle" }
            ].map((category, index) => (
              <div key={index} className="overflow-hidden rounded-xl bg-green-50 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                <Image
                  width={500}
                  height={500} 
                  src={category.image} 
                  alt={category.title} 
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{category.title}</h3>
                  <p className="mb-4 text-gray-600">{category.description}</p>
                  <a href="#" className="flex items-center font-medium text-green-600 transition-colors hover:text-green-700">
                    Browse Collection <ArrowRight className="ml-2 size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features
