import Container from '@/components/ui/Container';

const Navbar = () => {
    return (
        <nav className="z-50 border-b bg-white">
            <Container className="sticky top-0 z-50 flex h-16 justify-between py-0">
                <div className="flex w-full items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        height={40}
                        width={40}
                        className="rounded-full border"
                        src="https://cumillapoly.gov.bd/wp-content/uploads/elementor/thumbs/300521_02_59_10-pw3wkuctbqgomd0rbugx0zkr2bqfu9m3bbalucmo0w.png"
                        alt="Cumilla polytechnic institute"
                    />
                    <h2>
                        <span className="text-xl font-bold text-primary">Comilla Polytechnic Institute</span>
                    </h2>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;
