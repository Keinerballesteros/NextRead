function ConfirmEmailPage() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Confirm Email
        </h2>

        <form className="space-y-5">

          <label className=" w-full input input-bordered flex items-center gap-2 bg-white/10 text-white placeholder-gray-300">
            <svg
              className="h-5 opacity-70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              className="grow bg-transparent focus:outline-none"
            />
          </label>

          
          <button
            type="submit"
            className="btn btn-dash btn-info w-full rounded-xl shadow-lg transition-all duration-500 hover:scale-105"
          >
            Send Email
          </button>
        </form>
      </div>
    </section>
  );
}

export default ConfirmEmailPage;