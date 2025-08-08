export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div style={{textAlign:'center'}}>
        <h1>404</h1>
        <p>Page non trouvée</p>
        <a href="/">Retour à l'accueil</a>
      </div>
    </div>
  );
} 