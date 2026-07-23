import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const focusAreas = [
  {
    symbol: '~',
    tag: 'Flexibility',
    title: 'Range before force',
    copy: 'Explore poses selected around your current mobility, pain area, and physical profile.',
  },
  {
    symbol: '+',
    tag: 'Strength',
    title: 'Build without strain',
    copy: 'Difficulty is matched to your activity level, so your practice starts from a realistic place.',
  },
  {
    symbol: 'O',
    tag: 'Balance',
    title: 'Steady, supported movement',
    copy: 'Clear pose details, target areas, and precautions help you approach each movement thoughtfully.',
  },
  {
    symbol: '=',
    tag: 'Calm',
    title: 'A quieter rhythm',
    copy: 'Create space for slower, breath-led movement with recommendations shaped by your needs.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    copy: 'Register securely so your profile and recommendations stay connected to you.',
  },
  {
    number: '02',
    title: 'Share your health profile',
    copy: 'Add your age, activity level, measurements, and the area where you experience pain.',
  },
  {
    number: '03',
    title: 'Explore matched poses',
    copy: 'Review active poses ranked for your pain area, activity level, and BMI category.',
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="-m-4 bg-[#eaeee3] text-[#1f2a24] sm:-m-6">
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="home-kicker mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#718267]">
            Personalized practice, not a generic flow
          </p>
          <h1 className="home-display max-w-2xl text-[2.15rem] font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-[3.5rem]">
            A yoga practice shaped by{' '}
            <span className="italic text-[#a66e24]">your body</span>, not a
            one-size-fits-all list.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#5b6b5e] sm:mt-6 sm:text-lg sm:leading-8">
            Tell MyYoga about your health profile, pain area, and activity
            level. You&apos;ll receive a clear set of rule-based pose matches, with
            the details you need to practice more thoughtfully.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              to={user ? '/recommendations' : '/register'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c0812e] px-5 py-3 text-center font-semibold text-[#1a261f] transition hover:bg-[#a66e24] focus:outline-none focus:ring-2 focus:ring-[#c0812e] focus:ring-offset-2 sm:w-auto sm:px-6"
            >
              {user ? 'View recommendations' : 'Start your practice'}
              <ArrowIcon />
            </Link>
            <Link
              to={user ? '/health-profile' : '/login'}
              className="w-full rounded-full border border-[#c8d0bd] px-5 py-3 text-center font-medium transition hover:border-[#8aa07e] hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-[#8aa07e] focus:ring-offset-2 sm:w-auto sm:px-6"
            >
              {user ? 'Update health profile' : 'I already have an account'}
            </Link>
          </div>
          <p className="mt-8 max-w-lg text-sm leading-6 text-[#667366]">
            Recommendations are wellness guidance based on simple matching
            rules and are not a substitute for professional medical advice.
          </p>
        </div>

        <div
          className="relative flex h-60 items-center justify-center sm:h-72 md:h-96"
          aria-hidden="true"
        >
          <div className="home-breathe-ring home-breathe-ring-one absolute size-44 rounded-full border border-[#8aa07e] sm:size-56" />
          <div className="home-breathe-ring home-breathe-ring-two absolute size-44 rounded-full border border-[#c0812e] sm:size-56" />
          <div className="home-breathe-core relative flex size-36 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#2d4335,#1a261f)] text-center text-[#eaeee3] shadow-2xl sm:size-44">
            <div>
              <div className="home-kicker text-[11px] uppercase tracking-[0.2em] opacity-75">
                breathe
              </div>
              <div className="home-display mt-1 text-2xl italic">in, out</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#d8decb] bg-[#fbfaf4]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#718267]">
            A simple path
          </p>
          <h2 className="home-display mt-3 max-w-xl text-3xl font-medium md:text-4xl">
            From profile to practice in three steps
          </h2>
          <div className="mt-9 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="border-t border-[#d8decb] pt-5">
                <div className="home-kicker text-sm tracking-[0.18em] text-[#8aa07e]">
                  {step.number}
                </div>
                <h3 className="home-display mt-3 text-2xl font-medium">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5b6b5e]">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="focus-areas" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-xl">
          <p className="home-kicker text-xs font-semibold uppercase tracking-[0.2em] text-[#718267]">
            What your practice supports
          </p>
          <h2 className="home-display mt-3 text-3xl font-medium md:text-4xl">
            Every match has a reason
          </h2>
        </div>
        <div className="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {focusAreas.map((area) => (
            <article
              key={area.tag}
              className="rounded-2xl border border-[#d8decb] bg-[#fbfaf4] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-[#eaeee3] text-xl text-[#233329]">
                {area.symbol}
              </div>
              <p className="home-kicker mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#718267]">
                Focus / {area.tag}
              </p>
              <h3 className="home-display mt-2 text-xl font-medium">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5b6b5e]">
                {area.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1a261f] text-[#eaeee3]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 px-4 py-12 sm:px-6 sm:py-16 md:flex-row">
          <div>
            <p className="home-kicker text-xs uppercase tracking-[0.2em] text-[#a9b7a9]">
              Begin where you are
            </p>
            <h2 className="home-display mt-3 max-w-xl text-center text-3xl font-medium md:text-left md:text-4xl">
              Build a practice that starts with your needs.
            </h2>
          </div>
          <Link
            to={user ? '/recommendations' : '/register'}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#c0812e] px-6 py-3.5 text-center font-semibold text-[#1a261f] transition hover:bg-[#d39339] sm:w-auto sm:px-7"
          >
            {user ? 'See my matches' : 'Create your profile'}
            <ArrowIcon />
          </Link>
        </div>
        <footer className="border-t border-[#2e4237]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm text-[#a9b7a9] sm:flex-row sm:px-6 sm:text-left">
            <span className="home-display text-lg italic text-[#eaeee3]">
              MyYoga
            </span>
            <p>
              Copyright {new Date().getFullYear()} MyYoga. Personalized yoga pose
              recommendations.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-4"
      aria-hidden="true"
    >
      <path
        d="M4 10h12m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
