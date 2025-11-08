'use client'

import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from '@/hooks/useTranslation'
import Image from 'next/image'
import client1 from '@/public/testimonials/client1.jpg'
import client2 from '@/public/testimonials/user2.jpeg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
export function TestimonialsSection() {
  const { t } = useTranslation()

  const testimonials = [
    {
      id: 'ali razaq',
      image: client2,
      name: t('landing.testimonials.reviews.karen.author') || '—أحمد الراشد، صاحب عمل',
      text: t('landing.testimonials.reviews.karen.text') || '"خدمات ليجاتو القانونية كانت استثنائية لأعمالنا. خبرتهم في القانون السعودي ونهجهم المهني جعل إدارة العقود سلسة وفعالة."',
      bgColor: 'bg-primary/20',
      quoteColor: 'text-primary'
    },
    {
      id: 'rehman',
      image: client1,
      name: t('landing.testimonials.reviews.karen.author') || '—أحمد الراشد، صاحب عمل',
      text: t('landing.testimonials.reviews.karen.text') || '"خدمات ليجاتو القانونية كانت استثنائية لأعمالنا. خبرتهم في القانون السعودي ونهجهم المهني جعل إدارة العقود سلسة وفعالة."',
      bgColor: 'bg-primary/20',
      quoteColor: 'text-primary'
    },
    
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">{t('landing.testimonials.title')}</h2>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            // autoplay={{
            //   delay: 5000,
            //   disableOnInteraction: false,
            // }}
            loop={true}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="px-4">
                  <div className={`${testimonial.bgColor} rounded-2xl p-8 text-center relative max-w-4xl mx-auto min-h-[400px] flex flex-col justify-center`}>
                    {/* Profile Image */}
                    <div className="mb-6">
                      <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to a placeholder if image doesn't exist
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiIGZpbGw9IiM5Y2EzYWYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K'
                          }}
                        />
                      </div>
                    </div>

                    {/* Quote Icon */}
                    <div className={`text-6xl mb-4 ${testimonial.quoteColor}`}>,,</div>
                    
                    {/* Testimonial Text */}
                    <p className="text-xl mb-6 leading-relaxed text-gray-800">
                      {testimonial.text}
                    </p>
                    
                    {/* Author Name */}
                    <p className="text-lg font-semibold text-gray-700 mb-2">{testimonial.name}</p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-primary fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !text-gray-600 !bg-white !shadow-lg !rounded-full !w-12 !h-12 !mt-0 !left-0 !top-1/2 !-translate-y-1/2 hover:!bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </div>
          <div className="swiper-button-next !text-gray-600 !bg-white !shadow-lg !rounded-full !w-12 !h-12 !mt-0 !right-0 !top-1/2 !-translate-y-1/2 hover:!bg-gray-50 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </div>

          {/* Custom Pagination */}
          <div className="swiper-pagination !relative !mt-8 !bottom-0"></div>
        </div>
      </div>
    </section>
  )
}
