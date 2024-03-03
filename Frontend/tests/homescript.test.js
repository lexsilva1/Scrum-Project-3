import createTaskElement from './homescript.js';
describe('createTaskElement', () => {
    it('should create a task element with the correct properties', () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        category: 'Test Category',
        priority: 100,
        status: 10,
        startDate: '2022-01-01',
        endDate: '2022-12-31'
      };
  
      const taskElement = createTaskElement(mockTask);
  
      expect(taskElement.id).toBe(mockTask.id);
      expect(taskElement.title).toBe(mockTask.title);
      expect(taskElement.description).toBe(mockTask.description);
      expect(taskElement.category).toBe(mockTask.category);
      expect(taskElement.priority).toBe(mockTask.priority);
      expect(taskElement.status).toBe('todo');
      expect(taskElement.startdate).toBe(mockTask.startDate);
      expect(taskElement.enddate).toBe(mockTask.endDate);
      expect(taskElement.classList.contains('task')).toBe(true);
      expect(taskElement.classList.contains('low')).toBe(true);
    });
  
    // Add more tests as needed to check other behaviors of the function
  });