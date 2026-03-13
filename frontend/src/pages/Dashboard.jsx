import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiCalendar, FiTrendingUp, FiTrendingDown, FiPackage } from 'react-icons/fi';
import { PageHeader } from '../components/Layout';
import { StatCard, BarChartCard, PieChartCard } from '../components/charts';
import { Card } from '../components/ui';
import { clienteService, claseService, economiaService, productoService } from '../services/api';

export default function Dashboard() {
  const { data: clientesRaw } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll().then(res => res.data)
  });

  const { data: clasesRaw } = useQuery({
    queryKey: ['clases'],
    queryFn: () => claseService.getAll().then(res => res.data)
  });

  const { data: economiaRaw } = useQuery({
    queryKey: ['economia'],
    queryFn: () => economiaService.getBalance().then(res => res.data)
  });

  const { data: productosRaw } = useQuery({
    queryKey: ['productos'],
    queryFn: () => productoService.getAll().then(res => res.data)
  });

  const { data: estadisticasClientes } = useQuery({
    queryKey: ['estadisticas-clientes'],
    queryFn: () => clienteService.getEstadisticas().then(res => res.data)
  });

  // Normalizar datos
  const clientes = Array.isArray(clientesRaw) ? clientesRaw : clientesRaw?.data || [];
  const clases = Array.isArray(clasesRaw) ? clasesRaw : clasesRaw?.data || [];
  const economia = economiaRaw?.data || economiaRaw || { ingresos: 0, gastos: 0, balance: 0 };
  const productos = Array.isArray(productosRaw) ? productosRaw : productosRaw?.productos || [];

  const generoData = estadisticasClientes?.porGenero?.map(item => ({
    name: item.genero === 'masculino' ? 'Masculino' : item.genero === 'femenino' ? 'Femenino' : 'Otro',
    value: parseInt(item.cantidad),
    color: item.genero === 'masculino' ? '#6366f1' : item.genero === 'femenino' ? '#ec4899' : '#10b981'
  })) || [{ name: 'Sin datos', value: 0, color: '#cbd5e1' }];

  const edadData = estadisticasClientes?.porEdad?.map(item => ({
    name: item.rango,
    cantidad: parseInt(item.cantidad)
  })) || [{ name: 'Sin datos', cantidad: 0 }];

  const totalClientes = clientes?.length || 0;
  const totalClases = clases?.length || 0;
  const balance = economia?.balance || 0;
  const productosArray = Array.isArray(productos) ? productos : productos?.productos || [];
  const totalProductos = productosArray.reduce((acc, p) => acc + (p.stock || 0), 0) || 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen general del gimnasio" />

      <div className="stats-grid">
        <StatCard
          title="Total Clientes"
          value={totalClientes}
          icon={FiUsers}
          color="primary"
        />
        <StatCard
          title="Clases Activas"
          value={totalClases}
          icon={FiCalendar}
          color="success"
        />
        <StatCard
          title="Balance"
          value={balance}
          icon={balance >= 0 ? FiTrendingUp : FiTrendingDown}
          color={balance >= 0 ? 'success' : 'danger'}
          format="currency"
        />
        <StatCard
          title="Stock Productos"
          value={totalProductos}
          icon={FiPackage}
          color="warning"
        />
      </div>

      <div className="charts-grid">
        <PieChartCard
          title="Distribución por Género"
          data={generoData}
          height={280}
        />
        <BarChartCard
          title="Clientes por Rango de Edad"
          data={edadData}
          dataKey="cantidad"
          xAxisKey="name"
          height={280}
        />
      </div>

      <div className="charts-grid">
        <Card title="Clases Más Populares">
          <div className="card-body">
            {clases?.slice(0, 5).map((clase, index) => (
              <div key={clase.id} className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="badge badge--primary">{index + 1}</span>
                  <span className="font-medium">{clase.nombre}</span>
                </div>
                <span className="text-muted">{clase.horario}</span>
              </div>
            ))}
            {(!clases || clases.length === 0) && (
              <p className="text-muted text-center">No hay clases registradas</p>
            )}
          </div>
        </Card>

        <Card title="Resumen Económico">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted">Ingresos Totales</span>
              <span className="font-semibold text-success">{formatCurrency(economia?.ingresos || 0)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted">Gastos Totales</span>
              <span className="font-semibold text-danger">{formatCurrency(economia?.gastos || 0)}</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-200)', marginBottom: '1rem' }} />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Balance Total</span>
              <span className={`font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
