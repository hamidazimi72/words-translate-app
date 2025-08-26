type MainTemplateProps = {
  children?: any;
  boxProps?: React.HtmlHTMLAttributes<HTMLDivElement>;
};

export const MainTemplate: React.FC<MainTemplateProps> = ({ boxProps, children }) => {
  return (
    <div {...boxProps} className={`bg-white max-w-md min-h-dvh mx-auto shadow flex ${boxProps?.className || ""}`}>
      {children}
    </div>
  );
};
