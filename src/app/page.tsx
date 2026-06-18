export default function LandingPage() {
  return (
    <div className="text-white space-y-10">

      {/* HERO */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">
          🦈 SharkEvents
        </h1>

        <p className="text-zinc-300 text-lg leading-relaxed">
          A <b>SharkEvents</b> é a plataforma oficial de eventos da comunidade <b>SharkCoders</b> 🚀.  
          Aqui podes descobrir, participar e gerir eventos ligados à tecnologia, programação e inovação 💻⚡.
          Foi criada para aproximar alunos, professores e a comunidade tech num único espaço digital 🤝.
        </p>
      </section>

      {/* ABOUT SHARKCODERS */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          Sobre a SharkCoders
        </h2>

        <p className="text-zinc-400 leading-relaxed">
          🦈 <b>SharkCoders</b> é a primeira rede portuguesa de escolas de programação, robótica e tecnologia para crianças e jovens 🚀. 
          Transformamos alunos em <b>criadores de tecnologia</b>, através de experiências práticas, criativas e divertidas 💡.  
          Trabalhamos programação 💻, criação de jogos 🎮, desenvolvimento de apps 📱, robótica 🤖 e inteligência artificial 🧠, sempre com o objetivo de inspirar uma nova geração a pensar, criar e inovar com tecnologia 🎯.
        </p>

        <p className="text-zinc-400">
          <i>“Do consumo de tecnologia à criação de tecnologia.” 🦈</i>
        </p>
      </section>

      {/* ABOUT SHARKEVENTS */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          Sobre o SharkEvents
        </h2>

        <p className="text-zinc-400 leading-relaxed">
          O <b>SharkEvents</b> permite criar, gerir e participar em eventos com sistema de registo e check-in em tempo real ⚡.  
          Cada evento pode incluir inscrições, controlo de participantes e experiência interativa para toda a comunidade 💻🤝.  
          O objetivo é tornar a gestão de eventos simples, moderna e escalável, acompanhando o crescimento da SharkCoders 🚀.
        </p>
      </section>

    </div>
  );
}