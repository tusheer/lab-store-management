type PageHeadingProps = {
    title: string;
    description?: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({ description, title }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">{title}</h2>
            {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
    );
};

export default PageHeading;
