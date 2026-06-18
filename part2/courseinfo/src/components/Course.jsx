const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Header = ({ name }) => {
    return (
        <h2>{name}</h2>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <h4>total of {total} exercises</h4>
    )
}

const Course = ({ courses }) => {
    return (
        <div>
            {courses.map(course =>
                <div key={course.id}>
                    <Header name={course.name} />
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            )}
        </div>
    )
}

export default Course