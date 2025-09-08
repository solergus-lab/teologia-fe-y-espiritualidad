import React, { useMemo, useState } from 'react';

type Source = {
  id: string;
  autor: string;
  categoria: 'Doctor de la Iglesia' | 'Teólogo' | 'Filósofo';
  obra: string;
  seccion?: string;
  temas: string[];
  url: string;
  cita: string;
};

const KB: Source[] = [
  { id:'tomas-summa', autor:'Santo Tomás de Aquino', categoria:'Doctor de la Iglesia', obra:'Summa Theologiae', seccion:'I, q.1', temas:['fe y razón','sacra doctrina'], url:'https://www.newadvent.org/summa/', cita:'La gracia no destruye la naturaleza, sino que la perfecciona.' },
  { id:'agustin-conf', autor:'San Agustín de Hipona', categoria:'Doctor de la Iglesia', obra:'Confesiones', seccion:'I,1', temas:['inquietud del corazón','conversión'], url:'https://www.augustinus.it/spagnolo/confesiones/index2.htm', cita:'Nos hiciste, Señor, para ti y nuestro corazón está inquieto hasta que descanse en ti.' },
  { id:'bonaventura-itinerarium', autor:'San Buenaventura', categoria:'Doctor de la Iglesia', obra:'Itinerarium mentis in Deum', seccion:'I–II', temas:['contemplación','ascenso'], url:'https://sourcebooks.fordham.edu/basis/bonaventura-itinerarium.asp', cita:'El alma asciende a Dios a través de sus huellas en la creación y la iluminación interior.' },
  { id:'teresa-castillo', autor:'Santa Teresa de Ávila', categoria:'Doctor de la Iglesia', obra:'Libro de la vida / Castillo interior', seccion:'Vida 8,5', temas:['oración','amistad con Dios'], url:'https://www.cervantesvirtual.com/obra-visor/libro-de-la-vida--0/html/', cita:'La oración no es otra cosa sino tratar de amistad, estando muchas veces tratando a solas con quien sabemos nos ama.' },
  { id:'juan-cruz-subida', autor:'San Juan de la Cruz', categoria:'Doctor de la Iglesia', obra:'Subida / Noche / Dichos', temas:['desapropiación','mística'], url:'https://www.mercaba.org/SANJUAN/san_juan_de_la_cruz.htm', cita:'Para venir a poseerlo todo, no quieras poseer algo en nada.' },
  { id:'gregorio-magno', autor:'San Gregorio Magno', categoria:'Doctor de la Iglesia', obra:'Moralia in Iob', temas:['escritura','sabiduría'], url:'https://www.documentacatholicaomnia.eu/04z/z_0540-0604__Gregorius_I_Magnus__Moralia_In_Iob__MLT.pdf.html', cita:'Las Escrituras crecen con quien las lee.' },
  { id:'anselmo-fides', autor:'San Anselmo de Canterbury', categoria:'Doctor de la Iglesia', obra:'Proslogion', temas:['fe y entendimiento','argumento'], url:'https://plato.stanford.edu/entries/anselm/', cita:'No busco comprender para creer, sino que creo para comprender.' },
  { id:'ratzinger-intro', autor:'Joseph Ratzinger (Benedicto XVI)', categoria:'Teólogo', obra:'Introducción al Cristianismo / Homilías', temas:['fe y razón','Cristo'], url:'https://www.vatican.va/content/benedict-xvi/es/homilies.index.html', cita:'La fe es encuentro con una Persona viva: Jesucristo.' },
  { id:'balthasar-gloria', autor:'Hans Urs von Balthasar', categoria:'Teólogo', obra:'Gloria', temas:['belleza','revelación'], url:'https://www.communio-icr.com/', cita:'Sólo el amor es digno de fe.' },
  { id:'rahner', autor:'Karl Rahner', categoria:'Teólogo', obra:'Escritos teológicos', temas:['mística cotidiana','trascendental'], url:'https://www.herdereditorial.com/blogs/revista-rahner', cita:'El cristiano del futuro será un místico o no será.' },
  { id:'aristoteles-met', autor:'Aristóteles', categoria:'Filósofo', obra:'Metafísica / Física', temas:['acto y potencia','causas'], url:'https://www.perseus.tufts.edu/hopper/collection?collection=Perseus%3Acollection%3AGreco-Roman', cita:'El acto es anterior por naturaleza a la potencia.' },
  { id:'platon-republica', autor:'Platón', categoria:'Filósofo', obra:'República', temas:['bien','contemplación'], url:'http://classics.mit.edu/Plato/republic.html', cita:'El Bien es causa de lo cognoscible y de la verdad.' },
  { id:'boecio', autor:'Boecio', categoria:'Filósofo', obra:'Consolación de la Filosofía', temas:['providencia','fortuna'], url:'https://www.gutenberg.org/ebooks/14328', cita:'La providencia es el plan divino que lo abarca todo.' },
];

type Mode = 'puntual' | 'comparativo' | 'resumen';

export default function App(){
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('puntual');
  const [filters, setFilters] = useState<string[]>([]);
  const [results, setResults] = useState<Source[]>([]);
  const [answer, setAnswer] = useState<string>('');

  const categorias = ['Doctor de la Iglesia','Teólogo','Filósofo'] as const;

  function toggleFilter(cat: string){
    setFilters(prev => prev.includes(cat) ? prev.filter(x=>x!==cat) : [...prev, cat]);
  }

  const filteredKB = useMemo(()=>{
    const base = KB.filter(item => filters.length ? filters.includes(item.categoria) : true);
    if(!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(item =>
      item.autor.toLowerCase().includes(q) ||
      item.obra.toLowerCase().includes(q) ||
      item.temas.some(t => t.toLowerCase().includes(q))
    );
  },[query, filters]);

  function buildAnswer(rows: Source[]): string {
    if(rows.length===0) return 'No encontré resultados con esos filtros.';
    if(mode==='puntual'){
      const p = rows[0];
      return `**Respuesta puntual**\n• ${p.autor}, *${p.obra}*: ${p.cita} \n→ Fuente: <a class="underline text-blue-600" href="${p.url}" target="_blank" rel="noreferrer">texto exacto</a>`;
    }
    if(mode==='comparativo'){
      const take = rows.slice(0,3);
      let s = '**Comparativo** — Coincidencias y matices:\n';
      s += take.map(p=>`• ${p.autor}, *${p.obra}*: ${p.cita} \n→ <a class="underline text-blue-600" href="${p.url}" target="_blank" rel="noreferrer">ver pasaje</a>`).join('\n');
      return s;
    }
    const take = rows.slice(0,4);
    let s = '**Resumen** — En síntesis: la tradición articula fe, razón y vida espiritual en continuidad.\n';
    s += take.map(p=>`• ${p.autor}: <a class="underline text-blue-600" href="${p.url}" target="_blank" rel="noreferrer">cita fuente</a>`).join('\n');
    return s;
  }

  function onSearch(e?: React.FormEvent){
    if(e) e.preventDefault();
    setResults(filteredKB);
    setAnswer(buildAnswer(filteredKB));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">T</div>
          <h1 className="text-2xl font-semibold text-slate-800">Teología y Espiritualidad</h1>
          <span className="ml-2 text-xs px-2 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700">Demo</span>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="card">
            <form onSubmit={onSearch} className="space-y-3">
              <input
                className="input"
                placeholder="Busca por autor, obra o tema (ej.: Tomás, Agustín, mística, fe y razón)"
                value={query}
                onChange={e=>setQuery(e.target.value)}
              />
              <select value={mode} onChange={e=>setMode(e.target.value as Mode)} className="input">
                <option value="puntual">Modo: puntual</option>
                <option value="comparativo">Modo: comparativo</option>
                <option value="resumen">Modo: resumen</option>
              </select>
              <div className="flex flex-wrap gap-2">
                {categorias.map(cat => (
                  <span
                    key={cat}
                    className={`pill ${filters.includes(cat)?'active':''}`}
                    onClick={()=>toggleFilter(cat)}
                    title={cat}
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <button type="submit" className="btn w-full">Consultar</button>
            </form>
          </section>

          <section className="card">
            <h3 className="font-medium mb-2">Respuesta</h3>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{__html: answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
            </div>
          </section>
        </div>

        <section className="card">
          <h3 className="font-medium mb-3">Resultados</h3>
          {results.length===0 ? (
            <p className="text-sm text-slate-500">Sin resultados aún. Realiza una consulta.</p>
          ) : (
            <ul className="list-disc ml-6 space-y-2">
              {results.map(r=> (
                <li key={r.id}>
                  <strong>{r.autor}</strong> — <em>{r.obra}</em> {r.seccion?`(${r.seccion})`:''} · <a className="underline text-blue-600" href={r.url} target="_blank" rel="noreferrer">enlace</a><br/>
                  <span className="text-xs text-slate-500">{r.categoria} · temas: {r.temas.join(', ')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}