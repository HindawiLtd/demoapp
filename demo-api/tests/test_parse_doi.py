import unittest

from demoapi.resources.files import _parse_doi


class ParseDoiTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def test_parsing_with_suffix_punctuation(self):
        text = '''
Assoc. 2017;6:e005999. DOI: 10.1161/JAHA.117.005999.)
Key Words: diabetes mellitus (cid:129) quality of care (cid:129) registry
        '''
        self.assertEqual(_parse_doi(text), "10.1161/JAHA.117.005999")

    def test_parsing_with_multiple_lines(self):
        text = '''
Assoc. 2017;6:e005999. DOI: 10.1161/JAHA.117.005999.)
Key Words: diabetes mellitus (cid:129) quality of care (cid:129) registry
Assoc. 2017;6:e005999. DOI: 10.1161/JAHA.117.005999.)
Key Words: diabetes mellitus (cid:129) quality of care (cid:129) registry
        '''
        self.assertEqual(_parse_doi(text), "10.1161/JAHA.117.005999")

    def test_return_the_first_doi_found(self):
        text = '''
Lorem ipsum dolor sit amet, http://dx.doi.org/https://doi.org/10.15779/Z38W96W consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, doi: 10.1093/nar/gkx393 quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. http://dx.doi.org/10.1155/2016/6520475
DOI: 10.1161/JAHA.117.005999 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, doi:10.3133/of2007-1047.srp029 sunt in culpa qui officia deserunt mollit anim id est laborum.
        '''
        self.assertEqual(_parse_doi(text), "10.15779/Z38W96W")


if __name__ == '__main__':
    unittest.main()
