import { faker } from '@helpscout/helix';
import { act, fireEvent, render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import type { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClientProvider } from 'react-query';
import {
  ContextFactory as mockContextFactory,
  CourseFactory,
  JoanieCourseRunFactory,
  JoanieEnrollmentFactory,
  OrderLiteFactory,
} from 'utils/test/factories';
import JoanieApiProvider from 'data/JoanieApiProvider';
import { CourseCodeProvider } from 'data/CourseCodeProvider';
import type { Course, CourseRun, Enrollment, OrderLite } from 'types/Joanie';
import createQueryClient from 'utils/react-query/createQueryClient';
import { Deferred } from 'utils/test/deferred';
import { Priority } from 'types';
import { CourseRunList, EnrollableCourseRunList, EnrolledCourseRun } from '.';

jest.mock('utils/context', () => ({
  __esModule: true,
  default: mockContextFactory({
    authentication: { backend: 'fonzie', endpoint: 'https://auth.test' },
    joanie_backend: { endpoint: 'https://joanie.test' },
  }).generate(),
}));

describe('CourseProductCourseRuns', () => {
  const dateFormatter = Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  afterEach(() => {
    fetchMock.restore();
    JoanieCourseRunFactory().afterGenerate((cr: CourseRun) => cr);
  });

  describe('CourseRunList', () => {
    const Wrapper = ({ children }: PropsWithChildren<{}>) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    );

    it('renders a warning message when no course runs are provided', () => {
      render(
        <Wrapper>
          <CourseRunList courseRuns={[]} />
        </Wrapper>,
      );

      expect(screen.getByText('No session available for this course.'));
    });

    it('renders a list of course runs', () => {
      const courseRuns: CourseRun[] = JoanieCourseRunFactory().generate(2);

      const { container } = render(
        <Wrapper>
          <CourseRunList courseRuns={courseRuns} />
        </Wrapper>,
      );

      // It should render all course runs provided
      expect(screen.getAllByRole('listitem')).toHaveLength(2);

      // there should be "Start" and "End" labels, hidden from screen readers
      // (they are repeated for SR users on each course run line, see below)
      const $section = container.querySelector('.course__course-runs-header');
      expect($section?.getAttribute('aria-hidden')).toBe('true');
      expect($section?.textContent).toBe('StartEnd');

      // For each course run, it should render course and enrollment dates
      courseRuns.forEach((courseRun: CourseRun) => {
        // - Course run start date should be displayed
        const $startDate = screen.getByTestId(`course-run-${courseRun.id}-start-date`);
        expect($startDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.start)));

        // - Course run end date should be displayed
        const $endDate = screen.getByTestId(`course-run-${courseRun.id}-end-date`);
        expect($endDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.end)));

        // "start" and "end" labels should be here, but visually hidden, only for screen reader users
        const $offscreenStartDate = screen.getByTestId(
          `course-run-${courseRun.id}-offscreen-start-date`,
        );
        const $offscreenEndDate = screen.getByTestId(
          `course-run-${courseRun.id}-offscreen-end-date`,
        );
        expect($offscreenStartDate.textContent).toEqual('Start');
        expect($offscreenStartDate.classList.contains('offscreen')).toBe(true);
        expect($offscreenEndDate.textContent).toEqual('End');
        expect($offscreenEndDate.classList.contains('offscreen')).toBe(true);

        // - Course run enrollment dates should be displayed
        const $enrollmentDates = screen.getByTestId(`course-run-${courseRun.id}-enrollment-dates`);
        expect($enrollmentDates.textContent).toEqual(
          `Enrollment from ${dateFormatter.format(
            new Date(courseRun.enrollment_start),
          )} to ${dateFormatter.format(new Date(courseRun.enrollment_end))}`,
        );
      });
    });
  });

  describe('EnrollableCourseRunList', () => {
    const Wrapper = ({ code, children }: PropsWithChildren<{ code: string }>) => (
      <IntlProvider locale="en">
        <CourseCodeProvider code={code}>
          <QueryClientProvider client={createQueryClient()}>
            <JoanieApiProvider>{children}</JoanieApiProvider>
          </QueryClientProvider>
        </CourseCodeProvider>
      </IntlProvider>
    );

    it('renders a warning message when no course runs are provided', () => {
      const order: OrderLite = OrderLiteFactory.generate();
      fetchMock.get('https://joanie.test/api/courses/00000/', 200);

      render(
        <Wrapper code="00000">
          <EnrollableCourseRunList courseRuns={[]} order={order} />
        </Wrapper>,
      );

      expect(screen.getByText('No session available for this course.'));
    });

    it('renders a list of course runs with a call to action to enroll', async () => {
      const course: Course = CourseFactory.generate();
      const courseRuns: CourseRun[] = JoanieCourseRunFactory().generate(2);
      const order: OrderLite = OrderLiteFactory.generate();
      fetchMock.get(`https://joanie.test/api/courses/${course.code}/`, 200);

      render(
        <Wrapper code={course.code}>
          <EnrollableCourseRunList courseRuns={courseRuns} order={order} />
        </Wrapper>,
      );

      // the list should contain only the course run items, without the call to action button
      expect(screen.getAllByRole('listitem')).toHaveLength(2);

      // For each course run, it should render course, enrollment dates and a checkbox input
      // to select the course run
      courseRuns.forEach((courseRun: CourseRun) => {
        // - Course run start date should be displayed
        const $startDate = screen.getByTestId(`course-run-${courseRun.id}-start-date`);
        expect($startDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.start)));

        // - Course run end date should be displayed
        const $endDate = screen.getByTestId(`course-run-${courseRun.id}-end-date`);
        expect($endDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.end)));

        // - Course run enrollment dates should be displayed
        const $enrollmentDates = screen.getByTestId(`course-run-${courseRun.id}-enrollment-dates`);
        expect($enrollmentDates.textContent).toEqual(
          `Enrollment from ${dateFormatter.format(
            new Date(courseRun.enrollment_start),
          )} to ${dateFormatter.format(new Date(courseRun.enrollment_end))}`,
        );

        // - A radio input
        screen.getByRole('radio', {
          name: `Select course run from ${dateFormatter.format(
            new Date(courseRun.start),
          )} to ${dateFormatter.format(new Date(courseRun.end))}.`,
        });
      });

      // A call to action should be displayed
      let $button: HTMLButtonElement = screen.getByRole('button', {
        name: 'Enroll',
      });
      // the button should be enabled to provide feedback to user on what to do if he clicks it early
      expect($button.disabled).toBe(false);

      // when we click the button without selecting anything, an error should be displayed
      await act(async () => {
        fireEvent.click($button);
      });
      const error = screen.getByText('Select a course run');
      // the error should be focused so that screen reader users understand better
      expect(document.activeElement).toEqual(error);
      expect($button.disabled).toBe(false);

      // Once a course run is selected, it should be enabled and allows user to enroll
      await act(async () => {
        // - Select the first course run
        const $radio = screen.getByRole('radio', {
          name: `Select course run from ${dateFormatter.format(
            new Date(courseRuns[0].start),
          )} to ${dateFormatter.format(new Date(courseRuns[0].end))}.`,
        });
        fireEvent.click($radio);
      });

      $button = screen.getByRole('button', {
        name: 'Enroll',
      });
      expect($button.disabled).toBe(false);

      // - User clicks to enroll
      fetchMock.resetHistory();
      const enrollmentDeferred = new Deferred();
      fetchMock.post('https://joanie.test/api/enrollments/', enrollmentDeferred.promise);

      await act(async () => {
        fireEvent.click($button);
      });

      // A spinner should be displayed
      screen.getByRole('status', { name: 'Enrolling...' });

      await act(async () => {
        enrollmentDeferred.resolve(200);
      });

      const calls = fetchMock.calls();
      expect(calls).toHaveLength(2);
      // A request to create the enrollment should have been executed
      expect(calls[0][0]).toBe('https://joanie.test/api/enrollments/');
      expect(JSON.parse(fetchMock.calls()[0][1]!.body as string)).toEqual({
        is_active: true,
        order: order.id,
        course_run: courseRuns[0].resource_link,
      });
      // Afterward a request to refresh the course should have been executed
      expect(calls[1][0]).toBe(`https://joanie.test/api/courses/${course.code}/`);
    });

    it('does not allow to enroll if course run is not opened for enrollment', async () => {
      const courseRun: CourseRun = JoanieCourseRunFactory()
        .afterGenerate((cr: CourseRun) => ({
          // - Course Run not yet opened for enrollment
          ...cr,
          enrollment_start: faker.date.future(0.25)().toISOString(),
          enrollment_end: faker.date.future(0.5)().toISOString(),
          start: faker.date.future(0.75)().toISOString(),
          end: faker.date.future(1.0)().toISOString(),
          state: {
            priority: faker.random.arrayElement([
              Priority.FUTURE_NOT_YET_OPEN,
              Priority.FUTURE_CLOSED,
              Priority.ONGOING_CLOSED,
              Priority.ARCHIVED_CLOSED,
              Priority.TO_BE_SCHEDULED,
            ])(),
            datetime: faker.date.future(0.25)().toISOString(),
            call_to_action: undefined,
            text: 'starting on',
          },
        }))
        .generate();
      const order = OrderLiteFactory.generate();
      fetchMock.get('https://joanie.test/api/courses/00000/', 200);

      render(
        <Wrapper code="00000">
          <EnrollableCourseRunList courseRuns={[courseRun]} order={order} />
        </Wrapper>,
      );

      // the list should contain only the course run items, without the call to action button
      expect(screen.getAllByRole('listitem')).toHaveLength(1);

      // For each course run, it should render course, enrollment dates and a checkbox input
      // to select the course run
      // - Course run start date should be displayed
      const $startDate = screen.getByTestId(`course-run-${courseRun.id}-start-date`);
      expect($startDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.start)));

      // - Course run end date should be displayed
      const $endDate = screen.getByTestId(`course-run-${courseRun.id}-end-date`);
      expect($endDate.textContent).toEqual(dateFormatter.format(new Date(courseRun.end)));

      // - Course run enrollment dates should be displayed
      const $enrollmentDates = screen.getByTestId(`course-run-${courseRun.id}-enrollment-dates`);
      expect($enrollmentDates.textContent).toEqual(
        `Enrollment from ${dateFormatter.format(
          new Date(courseRun.enrollment_start),
        )} to ${dateFormatter.format(new Date(courseRun.enrollment_end))}`,
      );

      // - A radio input
      screen.getByRole('radio', {
        name: `Select course run from ${dateFormatter.format(
          new Date(courseRun.start),
        )} to ${dateFormatter.format(new Date(courseRun.end))}.`,
      });

      // A call to action should be displayed when no course run is selected
      const $button: HTMLButtonElement = screen.getByRole('button', {
        name: 'Enroll',
      });
      // it should be enabled already to allow early user feedback
      expect($button.disabled).toBe(false);

      await act(async () => {
        // - Select the first course run
        const $radio = screen.getByRole('radio', {
          name: `Select course run from ${dateFormatter.format(
            new Date(courseRun.start),
          )} to ${dateFormatter.format(new Date(courseRun.end))}.`,
        });
        fireEvent.click($radio);
        fireEvent.click($button);
      });

      // - As the selected course run is not yet opened for enrollment,
      // a message should inform user that he/she cannot enroll now.
      // it should be focused so that screen reader users understand better
      // the submit button should stay enabled to always allow user feedback on its actions
      const error = screen.getByText(
        `Enrollment will open on ${dateFormatter.format(new Date(courseRun.enrollment_start))}`,
      );
      expect(document.activeElement).toEqual(error);
      expect($button.disabled).toBe(false);
    });
  });

  describe('EnrolledCourseRun', () => {
    const Wrapper = ({ code, children }: PropsWithChildren<{ code: string }>) => (
      <IntlProvider locale="en">
        <CourseCodeProvider code={code}>
          <QueryClientProvider client={createQueryClient()}>
            <JoanieApiProvider>{children}</JoanieApiProvider>
          </QueryClientProvider>
        </CourseCodeProvider>
      </IntlProvider>
    );

    it('renders enrollment information', () => {
      const enrollment: Enrollment = JoanieEnrollmentFactory.generate();
      fetchMock.get('https://joanie.test/api/courses/00000/', 200);
      render(
        <Wrapper code="00000">
          <EnrolledCourseRun enrollment={enrollment} />
        </Wrapper>,
      );

      // - It should render course dates,
      const $startDate = screen.getByTestId(`enrollment-${enrollment.id}-start-date`);
      expect($startDate.textContent).toEqual(
        dateFormatter.format(new Date(enrollment.course_run.start)),
      );
      const $endDate = screen.getByTestId(`enrollment-${enrollment.id}-start-date`);
      expect($endDate.textContent).toEqual(
        dateFormatter.format(new Date(enrollment.course_run.start)),
      );

      // "start" and "end" labels should be here but visually hidden for screen reader users
      const $offscreenStartDate = screen.getByTestId(
        `enrollment-${enrollment.id}-offscreen-start-date`,
      );
      const $offscreenEndDate = screen.getByTestId(
        `enrollment-${enrollment.id}-offscreen-end-date`,
      );
      expect($offscreenStartDate.textContent).toEqual('Start');
      expect($offscreenStartDate.classList.contains('offscreen')).toBe(true);
      expect($offscreenEndDate.textContent).toEqual('End');
      expect($offscreenEndDate.classList.contains('offscreen')).toBe(true);

      // - a link to access to the course,
      const $link: HTMLLinkElement = screen.getByRole('link', { name: 'Go to course' });
      expect($link).toHaveAttribute('href', enrollment.course_run.resource_link);

      // - a call to action to unroll to the course.
      screen.getByRole('button', { name: 'Unroll' });
    });

    it('allows to unroll', async () => {
      const course: Course = CourseFactory.generate();
      const enrollment: Enrollment = JoanieEnrollmentFactory.generate();
      fetchMock.get(`https://joanie.test/api/courses/${course.code}/`, 200);

      render(
        <Wrapper code={course.code}>
          <EnrolledCourseRun enrollment={enrollment} />
        </Wrapper>,
      );

      const $button: HTMLButtonElement = screen.getByRole('button', { name: 'Unroll' });

      fetchMock.resetHistory();
      const enrollmentDeferred = new Deferred();
      fetchMock.put(
        `https://joanie.test/api/enrollments/${enrollment.id}/`,
        enrollmentDeferred.promise,
      );

      await act(async () => {
        fireEvent.click($button);
      });

      // - While request is pending, an accessible spinner should be displayed
      screen.getByRole('status', { name: 'Unrolling...' });

      await act(async () => {
        enrollmentDeferred.resolve(200);
      });

      const calls = fetchMock.calls();
      expect(calls).toHaveLength(2);
      // A request to unroll user should have been executed
      expect(calls[0][0]).toBe(`https://joanie.test/api/enrollments/${enrollment.id}/`);
      expect(JSON.parse(fetchMock.calls()[0][1]!.body as string)).toEqual({
        is_active: false,
        course_run: enrollment.course_run.resource_link,
      });
      // Afterward a request to refresh the course should have been executed
      expect(calls[1][0]).toBe(`https://joanie.test/api/courses/${course.code}/`);
    });
  });
});
