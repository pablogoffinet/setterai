export default function Error() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <h1>Une erreur est survenue</h1>
        <p>Veuillez revenir à l'accueil.</p>
        <a href="/">Retour</a>
      </div>
    </div>
  );
}

