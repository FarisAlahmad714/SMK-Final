import ContactForm from '@/components/forms/ContactForm'

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          We're here to help you with any inquiries.
        </p>
      </div>
      <ContactForm />
    </div>
  )
}
