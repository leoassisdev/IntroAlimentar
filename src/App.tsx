import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import appIcon from '../icone.png'
import './App.css'

const API_BASE_URL = 'http://127.0.0.1:8001'

type Bebe = {
  id: string
  nome: string
  data_nascimento: string
  genero: string
  foto: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

type BebeDisplay = {
  id: string
  nome: string
  idade_meses: number
  fase_alimentar: string
}

type RegistroAlimentar = {
  id: string
  bebe_id: string
  data: string
  tipo_refeicao: string
  categoria: string
  nome_alimento: string
  tipo_corte: string | null
  aceitacao: number | null
  notas: string | null
  quantidade: number | null
  unidade: string | null
  alimento_alergenico: boolean
  created_at: string
}

const destaques = [
  {
    titulo: 'Perfil do bebê',
    texto: 'Cadastre nome, nascimento e gênero para personalizar a jornada alimentar.',
  },
  {
    titulo: 'Registros diários',
    texto: 'Em seguida vamos ligar refeições, água, leite e aceitação ao bebê ativo.',
  },
  {
    titulo: 'Alergênicos',
    texto: 'O acompanhamento de ofertas e reações virá como próximo módulo crítico.',
  },
  {
    titulo: 'Relatórios',
    texto: 'O objetivo é transformar a rotina em uma visão clara da evolução semanal.',
  },
]

const pilares = [
  'Cadastro local persistido via FastAPI + SQLite',
  'Leitura da fase alimentar direto da API',
  'Base pronta para Regra dos 3 e alergênicos',
  'Visual acolhedor para uso recorrente',
]

const faseLabels: Record<string, string> = {
  inicio: 'Início',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  familia: 'Família',
  antes_da_introducao: 'Antes da introdução',
}

const tipoRefeicaoOptions = [
  { value: 'cafe_manha', label: 'Café da manhã' },
  { value: 'almoco', label: 'Almoço' },
  { value: 'lanche_tarde', label: 'Lanche da tarde' },
  { value: 'jantar', label: 'Jantar' },
  { value: 'ceia', label: 'Ceia' },
  { value: 'mamada', label: 'Mamada' },
  { value: 'agua', label: 'Água' },
]

const categoriaOptions = [
  { value: 'frutas', label: 'Frutas' },
  { value: 'vegetais_folhosos', label: 'Folhosos' },
  { value: 'legumes', label: 'Legumes' },
  { value: 'proteinas', label: 'Proteínas' },
  { value: 'cereais', label: 'Cereais' },
  { value: 'leguminosas', label: 'Leguminosas' },
  { value: 'leite', label: 'Leite' },
  { value: 'agua', label: 'Água' },
]

function App() {
  const [bebes, setBebes] = useState<Bebe[]>([])
  const [displayMap, setDisplayMap] = useState<Record<string, BebeDisplay>>({})
  const [registros, setRegistros] = useState<RegistroAlimentar[]>([])
  const [activeBabyId, setActiveBabyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingRegistros, setLoadingRegistros] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingRegistro, setSavingRegistro] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [registroError, setRegistroError] = useState<string | null>(null)
  const [registroSuccess, setRegistroSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '',
    data_nascimento: '',
    genero: 'feminino',
  })
  const [registroForm, setRegistroForm] = useState({
    data: new Date().toISOString().slice(0, 10),
    tipo_refeicao: 'almoco',
    categoria: 'frutas',
    nome_alimento: '',
    tipo_corte: '',
    aceitacao: '4',
    notas: '',
    quantidade: '',
    unidade: 'g',
    alimento_alergenico: false,
  })

  async function loadBebes() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/bebes`)
      if (!response.ok) {
        throw new Error('Não foi possível carregar os bebês.')
      }

      const items: Bebe[] = await response.json()
      setBebes(items)

      const displays = await Promise.all(
        items.map(async (bebe) => {
          const displayResponse = await fetch(`${API_BASE_URL}/api/bebes/${bebe.id}/display`)
          if (!displayResponse.ok) {
            throw new Error('Não foi possível calcular a fase alimentar.')
          }
          return (await displayResponse.json()) as BebeDisplay
        }),
      )

      setDisplayMap(
        displays.reduce<Record<string, BebeDisplay>>((acc, item) => {
          acc[item.id] = item
          return acc
        }, {}),
      )
      setActiveBabyId((current) => current ?? items[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar o módulo de bebês.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBebes()
  }, [])

  async function loadRegistros(bebeId: string) {
    setLoadingRegistros(true)
    setRegistroError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/bebes/${bebeId}/registros`)
      if (!response.ok) {
        throw new Error('Não foi possível carregar os registros alimentares.')
      }

      const items: RegistroAlimentar[] = await response.json()
      setRegistros(items)
    } catch (err) {
      setRegistroError(
        err instanceof Error ? err.message : 'Falha ao carregar os registros alimentares.',
      )
    } finally {
      setLoadingRegistros(false)
    }
  }

  useEffect(() => {
    if (!activeBabyId) {
      setRegistros([])
      return
    }

    void loadRegistros(activeBabyId)
  }, [activeBabyId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/bebes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.detail ?? 'Não foi possível cadastrar o bebê.')
      }

      setForm({
        nome: '',
        data_nascimento: '',
        genero: 'feminino',
      })
      setSuccess('Bebê cadastrado com sucesso.')
      await loadBebes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar o bebê.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(bebeId: string) {
    setDeletingId(bebeId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/bebes/${bebeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.detail ?? 'Não foi possível remover o bebê.')
      }

      if (activeBabyId === bebeId) {
        setActiveBabyId(null)
      }

      setSuccess('Perfil removido com sucesso.')
      await loadBebes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao remover o bebê.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleRegistroSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeBabyId) {
      setRegistroError('Selecione um bebê antes de registrar uma refeição.')
      return
    }

    setSavingRegistro(true)
    setRegistroError(null)
    setRegistroSuccess(null)

    try {
      const payload = {
        data: registroForm.data,
        tipo_refeicao: registroForm.tipo_refeicao,
        categoria: registroForm.categoria,
        nome_alimento: registroForm.nome_alimento,
        tipo_corte: registroForm.tipo_corte || null,
        aceitacao:
          registroForm.tipo_refeicao === 'agua' || registroForm.categoria === 'agua'
            ? null
            : Number(registroForm.aceitacao),
        notas: registroForm.notas || null,
        quantidade: registroForm.quantidade ? Number(registroForm.quantidade) : null,
        unidade: registroForm.quantidade ? registroForm.unidade : null,
        alimento_alergenico: registroForm.alimento_alergenico,
      }

      const response = await fetch(`${API_BASE_URL}/api/bebes/${activeBabyId}/registros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.detail ?? 'Não foi possível salvar o registro.')
      }

      setRegistroForm((current) => ({
        ...current,
        nome_alimento: '',
        tipo_corte: '',
        notas: '',
        quantidade: '',
        aceitacao: current.tipo_refeicao === 'agua' ? '' : '4',
        alimento_alergenico: false,
      }))
      setRegistroSuccess('Registro alimentar salvo com sucesso.')
      await loadRegistros(activeBabyId)
    } catch (err) {
      setRegistroError(err instanceof Error ? err.message : 'Falha ao salvar o registro.')
    } finally {
      setSavingRegistro(false)
    }
  }

  const activeBaby = activeBabyId ? bebes.find((bebe) => bebe.id === activeBabyId) ?? null : null
  const activeDisplay = activeBaby ? displayMap[activeBaby.id] : null
  const registrosHoje = registros.filter(
    (registro) => registro.data === new Date().toISOString().slice(0, 10),
  )

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <img className="brand-icon" src={appIcon} alt="Ícone IntroAlimentar" />
          <div>
            <strong>IntroAlimentar</strong>
            <p>Introdução alimentar com carinho, clareza e rotina.</p>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Principal">
          <a href="#bebes">Bebês</a>
          <a href="#modulos">Módulos</a>
          <a href="#proxima-fase">Próxima fase</a>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Primeira tela funcional</span>
          <h1>Cadastre o bebê e comece a montar a rotina de introdução alimentar.</h1>
          <p>
            A base visual já virou produto real: agora o módulo Bebê está ligado à
            API local, com persistência e leitura de fase alimentar.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#bebes">
              Cadastrar bebê
            </a>
            <a className="secondary-action" href="#modulos">
              Ver módulos
            </a>
          </div>

          <div className="hero-pills">
            <span>FastAPI local</span>
            <span>SQLite</span>
            <span>React + Vite</span>
          </div>
        </div>

        <aside className="hero-panel">
          <span className="panel-label">Status atual</span>
          <h2>{activeBaby ? activeBaby.nome : 'Módulo Bebê ativo'}</h2>
          {activeBaby && activeDisplay ? (
            <div className="active-baby-summary">
              <div className="summary-pill">
                <span>Idade</span>
                <strong>{activeDisplay.idade_meses} meses</strong>
              </div>
              <div className="summary-pill">
                <span>Fase</span>
                <strong>{faseLabels[activeDisplay.fase_alimentar]}</strong>
              </div>
              <div className="summary-pill">
                <span>Nascimento</span>
                <strong>
                  {new Date(`${activeBaby.data_nascimento}T12:00:00`).toLocaleDateString('pt-BR')}
                </strong>
              </div>
            </div>
          ) : (
            <ul>
              <li>Cadastro funcionando no frontend</li>
              <li>Listagem vinda da API</li>
              <li>Fase alimentar calculada no backend</li>
            </ul>
          )}
          <div className="panel-callout">
            <strong>Próxima interface útil</strong>
            <p>
              Depois do cadastro do bebê, vamos conectar registros alimentares e
              acompanhamento da semana.
            </p>
          </div>
        </aside>
      </section>

      <section className="bebes-layout" id="bebes">
        <article className="form-card">
          <span className="card-kicker">Cadastro</span>
          <h2>Adicionar bebê</h2>
          <p>Esse será o ponto de entrada da jornada no app.</p>

          <form className="bebe-form" onSubmit={handleSubmit}>
            <label>
              Nome do bebê
              <input
                required
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                placeholder="Ex.: Helena"
              />
            </label>

            <label>
              Data de nascimento
              <input
                required
                type="date"
                value={form.data_nascimento}
                onChange={(event) =>
                  setForm((current) => ({ ...current, data_nascimento: event.target.value }))
                }
              />
            </label>

            <label>
              Gênero
              <select
                value={form.genero}
                onChange={(event) => setForm((current) => ({ ...current, genero: event.target.value }))}
              >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
              </select>
            </label>

            <button className="primary-action form-submit" disabled={saving} type="submit">
              {saving ? 'Salvando...' : 'Salvar bebê'}
            </button>
          </form>

          {error ? <p className="feedback error">{error}</p> : null}
          {success ? <p className="feedback success">{success}</p> : null}
        </article>

        <article className="list-card">
          <div className="list-header">
            <div>
              <span className="card-kicker">Bebês cadastrados</span>
              <h2>{bebes.length} perfil(is) no app</h2>
            </div>
            <button className="secondary-action refresh-button" onClick={() => void loadBebes()} type="button">
              Atualizar
            </button>
          </div>

          {loading ? <p className="empty-copy">Carregando os perfis cadastrados...</p> : null}

          {!loading && !bebes.length ? (
            <p className="empty-copy">
              Ainda não há bebês cadastrados. Use o formulário ao lado para criar o primeiro perfil.
            </p>
          ) : null}

          <div className="baby-grid">
            {bebes.map((bebe) => {
              const display = displayMap[bebe.id]

              return (
                <article
                  key={bebe.id}
                  className={`baby-card ${activeBabyId === bebe.id ? 'is-active' : ''}`}
                >
                  <span className="baby-badge">{display ? faseLabels[display.fase_alimentar] : 'Calculando fase'}</span>
                  <h3>{bebe.nome}</h3>
                  <p>
                    Nascimento: {new Date(`${bebe.data_nascimento}T12:00:00`).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="baby-meta">
                    <span>{display ? `${display.idade_meses} meses` : '...'}</span>
                    <span>{bebe.genero}</span>
                  </div>
                  <div className="baby-actions">
                    <button
                      className="secondary-action baby-action"
                      onClick={() => setActiveBabyId(bebe.id)}
                      type="button"
                    >
                      {activeBabyId === bebe.id ? 'Perfil ativo' : 'Ativar perfil'}
                    </button>
                    <button
                      className="danger-action baby-action"
                      disabled={deletingId === bebe.id}
                      onClick={() => void handleDelete(bebe.id)}
                      type="button"
                    >
                      {deletingId === bebe.id ? 'Removendo...' : 'Remover'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </article>
      </section>

      <section className="registros-layout">
        <article className="form-card">
          <span className="card-kicker">Registro diário</span>
          <h2>Adicionar refeição ou consumo</h2>
          <p>
            {activeBaby
              ? `Registrando a rotina de ${activeBaby.nome}.`
              : 'Ative um bebê acima para começar a registrar o dia.'}
          </p>

          <form className="registro-form" onSubmit={handleRegistroSubmit}>
            <div className="form-grid">
              <label>
                Data
                <input
                  required
                  type="date"
                  value={registroForm.data}
                  onChange={(event) =>
                    setRegistroForm((current) => ({ ...current, data: event.target.value }))
                  }
                />
              </label>

              <label>
                Refeição
                <select
                  value={registroForm.tipo_refeicao}
                  onChange={(event) =>
                    setRegistroForm((current) => ({ ...current, tipo_refeicao: event.target.value }))
                  }
                >
                  {tipoRefeicaoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid">
              <label>
                Categoria
                <select
                  value={registroForm.categoria}
                  onChange={(event) =>
                    setRegistroForm((current) => ({ ...current, categoria: event.target.value }))
                  }
                >
                  {categoriaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Aceitação
                <select
                  value={registroForm.aceitacao}
                  onChange={(event) =>
                    setRegistroForm((current) => ({ ...current, aceitacao: event.target.value }))
                  }
                >
                  <option value="">Sem nota</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
            </div>

            <label>
              Alimento
              <input
                required
                value={registroForm.nome_alimento}
                onChange={(event) =>
                  setRegistroForm((current) => ({ ...current, nome_alimento: event.target.value }))
                }
                placeholder="Ex.: Banana, arroz, água, frango desfiado"
              />
            </label>

            <div className="form-grid">
              <label>
                Tipo de corte
                <input
                  value={registroForm.tipo_corte}
                  onChange={(event) =>
                    setRegistroForm((current) => ({ ...current, tipo_corte: event.target.value }))
                  }
                  placeholder="Ex.: Palito, amassado, desfiado"
                />
              </label>

              <label>
                Quantidade
                <div className="inline-field">
                  <input
                    inputMode="decimal"
                    value={registroForm.quantidade}
                    onChange={(event) =>
                      setRegistroForm((current) => ({ ...current, quantidade: event.target.value }))
                    }
                    placeholder="Ex.: 80"
                  />
                  <select
                    value={registroForm.unidade}
                    onChange={(event) =>
                      setRegistroForm((current) => ({ ...current, unidade: event.target.value }))
                    }
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="min">min</option>
                    <option value="porcao">porção</option>
                  </select>
                </div>
              </label>
            </div>

            <label>
              Notas
              <textarea
                rows={3}
                value={registroForm.notas}
                onChange={(event) =>
                  setRegistroForm((current) => ({ ...current, notas: event.target.value }))
                }
                placeholder="Como foi a refeição, sinais de interesse, rejeição, textura..."
              />
            </label>

            <label className="check-row">
              <input
                checked={registroForm.alimento_alergenico}
                onChange={(event) =>
                  setRegistroForm((current) => ({
                    ...current,
                    alimento_alergenico: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              <span>Marcar como alimento alergênico</span>
            </label>

            <button
              className="primary-action form-submit"
              disabled={savingRegistro || !activeBaby}
              type="submit"
            >
              {savingRegistro ? 'Salvando registro...' : 'Salvar registro'}
            </button>
          </form>

          {registroError ? <p className="feedback error">{registroError}</p> : null}
          {registroSuccess ? <p className="feedback success">{registroSuccess}</p> : null}
        </article>

        <article className="list-card">
          <div className="list-header">
            <div>
              <span className="card-kicker">Histórico</span>
              <h2>{activeBaby ? `Dia alimentar de ${activeBaby.nome}` : 'Registros do bebê ativo'}</h2>
            </div>
            {activeBaby ? (
              <button
                className="secondary-action refresh-button"
                onClick={() => void loadRegistros(activeBaby.id)}
                type="button"
              >
                Atualizar
              </button>
            ) : null}
          </div>

          {activeDisplay ? (
            <div className="registro-summary">
              <div className="summary-pill">
                <span>Hoje</span>
                <strong>{registrosHoje.length} registro(s)</strong>
              </div>
              <div className="summary-pill">
                <span>Total</span>
                <strong>{registros.length} registro(s)</strong>
              </div>
              <div className="summary-pill">
                <span>Fase atual</span>
                <strong>{faseLabels[activeDisplay.fase_alimentar]}</strong>
              </div>
            </div>
          ) : null}

          {!activeBaby ? (
            <p className="empty-copy">
              Ative um perfil acima para liberar o diário alimentar e começar os registros.
            </p>
          ) : null}

          {activeBaby && loadingRegistros ? (
            <p className="empty-copy">Carregando o histórico alimentar...</p>
          ) : null}

          {activeBaby && !loadingRegistros && !registros.length ? (
            <p className="empty-copy">
              Ainda não há registros desse bebê. Faça a primeira refeição no formulário ao lado.
            </p>
          ) : null}

          <div className="registro-list">
            {registros.map((registro) => (
              <article key={registro.id} className="registro-card">
                <div className="registro-card-header">
                  <div>
                    <strong>{registro.nome_alimento}</strong>
                    <p>
                      {tipoRefeicaoOptions.find((item) => item.value === registro.tipo_refeicao)?.label ??
                        registro.tipo_refeicao}
                    </p>
                  </div>
                  <span className="baby-badge">
                    {new Date(`${registro.data}T12:00:00`).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="registro-meta">
                  <span>
                    {categoriaOptions.find((item) => item.value === registro.categoria)?.label ??
                      registro.categoria}
                  </span>
                  {registro.tipo_corte ? <span>{registro.tipo_corte}</span> : null}
                  {registro.quantidade && registro.unidade ? (
                    <span>
                      {registro.quantidade} {registro.unidade}
                    </span>
                  ) : null}
                  {registro.aceitacao ? <span>Aceitação {registro.aceitacao}/5</span> : null}
                  {registro.alimento_alergenico ? <span>Alergênico</span> : null}
                </div>

                {registro.notas ? <p className="registro-notes">{registro.notas}</p> : null}
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-grid" id="modulos">
        {destaques.map((item) => (
          <article key={item.titulo} className="feature-card">
            <span className="card-kicker">Módulo</span>
            <h3>{item.titulo}</h3>
            <p>{item.texto}</p>
          </article>
        ))}
      </section>

      <section className="journey-section">
        <div className="journey-copy">
          <span className="card-kicker">Base do produto</span>
          <h2>O app agora tem backend real e a primeira tela conectada.</h2>
          <p>
            A partir daqui, cada bloco novo do produto vai reaproveitar esse mesmo
            fluxo: domínio, API e interface prática.
          </p>
        </div>

        <div className="journey-list">
          {pilares.map((item) => (
            <div key={item} className="journey-item">
              <span className="journey-dot" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="next-step-card" id="proxima-fase">
        <span className="card-kicker">Próxima fase</span>
        <h2>Depois do bebê, vamos abrir o registro alimentar diário.</h2>
        <p>
          O próximo bloco funcional será criar refeições, água e leite com leitura
          por data e semana.
        </p>
      </section>
    </main>
  )
}

export default App
