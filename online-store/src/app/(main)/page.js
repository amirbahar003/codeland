import CourseCategories from "./components/CourseCategories/CourseCategories";
import LatestCourses from "./components/Courses/LatestCourse";
import Hero from "./components/Hero/Hero";
import LearningPaths from "./components/LearningPaths/LeaningPaths";
import SocialCard from "./components/SocialCard/SocialCard";
import StudentReviews from "./components/StudentReview/StudentReviews";

const Home = () => {
    return (
        <div className="relative isolate min-h-screen w-full bg-transparent">
            <Hero />
            <LatestCourses />
            <CourseCategories />
            <LearningPaths />
            <StudentReviews />
            <SocialCard />
        </div>
    );
};

export default Home;
