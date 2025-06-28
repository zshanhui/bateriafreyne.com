import type { Metadata } from "next";

import Prose from "components/prose";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  return {
    title: "Contact Page",
    description: "",
    openGraph: {
      publishedTime: "",
      modifiedTime: "",
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  return (
    <div className="m-4">
      <h1 className="mb-8 text-2xl font-bold">{`General Contact Form`}</h1>
      <Prose
        className="mb-8"
        html={`If you have any questions about any of our products, shipping times from our warehouse, or partnership questions, don't hesitate to contact us!`}
      />
      <div className="flex justify-center w-full">
        <form
          data-netlify="true"
          name="contact"
          method="POST"
          className="space-y-4 w-1/2"
        >
          <input type="hidden" name="form-name" value="contact" />
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company Website
            </label>
            <input
              type="url"
              id="company"
              name="company"
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-900 p-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
