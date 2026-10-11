const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d195.2767432436384!2d27.194276954454487!3d38.45468170968148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1791742452714!5m2!1str!2str";

const IletisimMap = () => {
  return (
    <div className="flex min-w-0 flex-[999_1_480px] flex-col">
      <iframe
        src={MAP_EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MotoPortal konumu - Google Haritalar"
        className="h-full min-h-[520px] w-full rounded-[16px] border border-border"
      />
    </div>
  );
};

export default IletisimMap;
