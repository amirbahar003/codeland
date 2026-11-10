
import ResponsiveCodeEditor from "../CodeEditor/ResponsiveCodeEditor";
import HeroRight from "./HeroRight";
import SiteContainer from "../layout/SiteContainer";

export default function Hero() {
    return (
        <section className="pt-28 sm:pt-32">
            <SiteContainer>
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
                    <ResponsiveCodeEditor />

                    <HeroRight />
                </div>
            </SiteContainer>
        </section>
    );
}

